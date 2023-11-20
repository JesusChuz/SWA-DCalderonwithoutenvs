// -----------------------------------------------------------------------
// <copyright file="MainWindow.xaml.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
//  </copyright>
// -----------------------------------------------------------------------

using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.MyWorkspace.ReleaseManager.DevOps;
using Microsoft.MyWorkspace.ReleaseManager.Models;
using Microsoft.VisualStudio.Services.ReleaseManagement.WebApi;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace Microsoft.MyWorkspace.ReleaseManager
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private static bool targetDev = false;
        private ReleaseAutomationClient client;
        private ObservableCollection<ReleaseDefinitionViewModel> releaseDefinitionViewModels;
        private ConcurrentBag<ReleaseDefinitionViewModel> releaseDefinitionsToMonitor = new ConcurrentBag<ReleaseDefinitionViewModel>();
        private System.Timers.Timer timer;
        private bool DeploymentUnderway;
        private readonly string vaultUrl = "https://kv-mw-dev-eus-001.vault.azure.net";

        public MainWindow()
        {
            InitializeComponent();

            timer = new System.Timers.Timer(1000);
            timer.Elapsed += Timer_Elapsed;
        }

        private async void Timer_Elapsed(object? sender, System.Timers.ElapsedEventArgs e)
        {
            bool done = true;
            foreach (var definition in releaseDefinitionsToMonitor)
            {
                var deployments = (await client.GetReleaseDeployments(definition.Id, definition.SelectedRelease.Id)).Where(d => IsDeploymentOfInterest(d));
                definition.Environments = deployments;
                var progress = GetProgress(deployments);
                if (progress != "100 %")
                    done = false;
                definition.Status = progress;
            }
            if (done)
            {
                timer.Stop();
                releaseDefinitionsToMonitor.Clear();
                DeploymentUnderway = false;
            }
        }

        private async void Window_Loaded(object sender, RoutedEventArgs e)
        {
            if (Environment.GetEnvironmentVariable("AZURE_TENANT_ID") == null
             || Environment.GetEnvironmentVariable("AZURE_CLIENT_ID") == null
             || Environment.GetEnvironmentVariable("AZURE_CLIENT_SECRET") == null)
            {
                _ = MessageBox.Show("Please set Azure environment variables - AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET", "Config", MessageBoxButton.OK, MessageBoxImage.Error);
                Environment.Exit(1);
            }

            deployButton.IsEnabled = false;
            Cursor = Cursors.Wait;

            var secretClient = new SecretClient(vaultUri: new Uri(vaultUrl), credential: new DefaultAzureCredential());
            var pat = await secretClient.GetSecretAsync("ReleaseManagerPAT");

            client = new ReleaseAutomationClient("https://dev.azure.com/MicrosoftIT/", pat.Value.Value, "OneITVSO");
            var releaseDefinitions = await client.GetReleaseDefinitions("E36-MWS-CEAA-VMAS-VMASVNext");

            releaseDefinitionViewModels = new ObservableCollection<ReleaseDefinitionViewModel>();
            foreach (var definition in releaseDefinitions)
            {
                if (definition.Name.Contains("SCUS")
                 || definition.Name.Contains("DevCluster")
                 || definition.Name.Contains("Auto")
                 || definition.Name.Contains("DO NOT USE")
                 || definition.Name.Contains("Orphaned"))
                {
                    continue;
                }
                var releases = await client.GetReleases(definition.Id);
                var definitionModel = new ReleaseDefinitionViewModel
                {
                    Id = definition.Id,
                    Name = definition.Name.Replace("E36-MWS-CEAA-VMAS-VMASVNext MyWorkspace-", string.Empty),
                };
                definitionModel.Releases = releases.Select(r => new ReleaseViewModel { Definition = definitionModel, Id = r.Id, Name = r.Name });
                releaseDefinitionViewModels.Add(definitionModel);
            }

            releasesListView.ItemsSource = releaseDefinitionViewModels;
            Cursor = Cursors.Arrow;
            deployButton.IsEnabled = true;
        }

        private async void DeployButton_Click(object sender, RoutedEventArgs e)
        {
            if (DeploymentUnderway)
            {
                _ = MessageBox.Show("A deployment is currently underway. Please wait for it to finish", "Deployment", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            if (releaseDefinitionViewModels.All(m => !m.ShouldBePerformed))
            {
                _ = MessageBox.Show("Please check atleast one release to deploy.", "Deployment", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            if (releaseDefinitionViewModels.Any(m => m.ShouldBePerformed && m.SelectedRelease is null))
            {
                _ = MessageBox.Show("Please ensure release version is selected for all checked releases.", "Deployment", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            var ignored_releases = new List<string>();
            var triggerTaskMap = new Dictionary<string, Task>();
            foreach (var definition in releaseDefinitionViewModels.Where(m => m.ShouldBePerformed))
            {
                foreach (var env in definition.Environments)
                {
                    if (env.DeploymentOperationStatus == DeploymentOperationStatus.Pending)
                    {
                        releaseDefinitionsToMonitor.Add(definition);
                        triggerTaskMap[env.Name] = client.TriggerReleaseEnvironmentDeploy(definition.SelectedRelease.Id, env.Name);
                    }
                    else
                    {
                        ignored_releases.Add($"{definition.Name} - {env.Name}");
                    }
                }
            }

            if (ignored_releases.Any())
            {
                _ = MessageBox.Show($"Ignoring following releases as they are not pending approval{Environment.NewLine}{Environment.NewLine}{string.Join($"{Environment.NewLine}{Environment.NewLine}", ignored_releases)}", "Ignored Releases", MessageBoxButton.OK, MessageBoxImage.Information);
            }

            deployButton.IsEnabled = false;
            Cursor = Cursors.Wait;

            var failedReleases = new List<(string, string)>();
            foreach (var name in triggerTaskMap.Keys)
            {
                try
                {
                    await triggerTaskMap[name];
                }
                catch (Exception ex)
                {
                    failedReleases.Add((name, ex.Message));
                }
            }
            Cursor = Cursors.Arrow;
            deployButton.IsEnabled = true;
            DeploymentUnderway = true;
            timer.Start();

            if (failedReleases.Any())
            {
                var message = string.Join($"{Environment.NewLine}{Environment.NewLine}", failedReleases.Select(fr => $"{fr.Item1} - {fr.Item2}"));
                _ = MessageBox.Show($"The following releases failed to deploy{Environment.NewLine}{Environment.NewLine}{message}");
            }
        }

        private async void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var comboBox = sender as ComboBox;
            var selectedItem = comboBox?.SelectedItem as ReleaseViewModel;
            if (selectedItem is not null)
            {
                var definition = selectedItem.Definition;
                deployButton.IsEnabled = false;
                Cursor = Cursors.Wait;

                definition.SelectedRelease = selectedItem;
                var deployments = (await client.GetReleaseDeployments(definition.Id, definition.SelectedRelease.Id)).Where(d => IsDeploymentOfInterest(d));
                definition.Environments = deployments;
                definition.Status = GetProgress(deployments);
                Cursor = Cursors.Arrow;
                deployButton.IsEnabled = true;
            }
        }

        private static bool IsDeploymentOfInterest(DeploymentLight d)
        {
            return targetDev ? !d.Name.Contains("Prod") && !d.Name.Contains("SCUS") : d.Name.Contains("Prod") && !d.Name.Contains("SCUS");
        }

        private string GetProgress(IEnumerable<DeploymentLight> deployments)
        {
            int score = 0;
            bool rejected = false;

            if (!deployments.Any())
            {
                return "100 %";
            }

            foreach (var deployment in deployments)
            {
                if (deployment.DeploymentOperationStatus == DeploymentOperationStatus.Rejected)
                {
                    rejected = true;
                }
                switch (deployment.DeploymentOperationStatus)
                {
                    case DeploymentOperationStatus.QueuedForAgent: score += 2; break;
                    case DeploymentOperationStatus.PhaseInProgress: score += 3; break;
                    case DeploymentOperationStatus.Approved:
                        if (deployment.DeploymentStatus == DeploymentStatus.Succeeded)
                            score += 4;
                        else if (deployment.DeploymentStatus == DeploymentStatus.NotDeployed)
                            score += 1;
                        break;
                    default: break;
                }
            }
            return rejected ? "Rejected": $"{(int)((score / (4.0 * deployments.Count())) * 100)} %";
        }
    }
}
