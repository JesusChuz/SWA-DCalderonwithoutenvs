// -----------------------------------------------------------------------
// <copyright file="ReleaseAutomationClient.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
//  </copyright>
// -----------------------------------------------------------------------

using Microsoft.MyWorkspace.ReleaseManager.Models;
using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.ReleaseManagement.WebApi;
using Microsoft.VisualStudio.Services.ReleaseManagement.WebApi.Clients;
using Microsoft.VisualStudio.Services.ReleaseManagement.WebApi.Contracts;
using Microsoft.VisualStudio.Services.WebApi;

namespace Microsoft.MyWorkspace.ReleaseManager.DevOps
{
    public class ReleaseAutomationClient
    {
        private readonly VssConnection connection;
        private readonly string projectName;

        public ReleaseAutomationClient(
                                        string baseDevOpsUrl,
                                        string patToken,
                                        string projectName)
        {
            var credentials = new VssBasicCredential("pat", patToken);
            connection = new VssConnection(new Uri(baseDevOpsUrl), credentials);
            this.projectName = projectName;
        }

        public async Task<object> GetRepositryBuildDefinitions()
        {
            try
            {
                BuildHttpClient buildClient = connection.GetClient<BuildHttpClient>();
                var response = await buildClient.GetDefinitionsAsync("OneITVSO", null, "c2578dc3-42eb-4553-801f-a17e4a2b5e0e", "TfsGit");

                return response;
            }
            catch (Exception ex)
            {

                throw;
            }

            return null;

        }

        public async Task<List<ReleaseDefinitionLight>> GetReleaseDefinitions(string searchString)
        {
            List<ReleaseDefinitionLight> releaseDefinitions = new List<ReleaseDefinitionLight>();

            try
            {
                ReleaseHttpClient releaseClient = connection.GetClient<ReleaseHttpClient>();
                List<ReleaseDefinition> response = await releaseClient.GetReleaseDefinitionsAsync(projectName, searchString);

                foreach (ReleaseDefinition rd in response)
                {
                    releaseDefinitions.Add(new ReleaseDefinitionLight()
                    {
                        Id = rd.Id,
                        Name = rd.Name,
                        Url = rd.Url,
                    });
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return releaseDefinitions;
        }

        public async Task<List<ReleaseLight>> GetReleases(int releaseDefinitionId)
        {
            List<ReleaseLight> releases = new List<ReleaseLight>();

            ReleaseHttpClient releaseClient = connection.GetClient<ReleaseHttpClient>();
            List<Release> response = await releaseClient.GetReleasesAsync(projectName, releaseDefinitionId, expand: ReleaseExpands.Artifacts, top: 5);

            foreach (Release release in response)
            {
                ArtifactSourceReference versionReference = null;
                if (release.Artifacts.Any())
                {
                    _ = release.Artifacts[0].DefinitionReference.TryGetValue("version", out versionReference);
                }

                releases.Add(new ReleaseLight()
                {
                    Id = release.Id,
                    Name = release.Name,
                    Url = ((ReferenceLink)release.Links.Links["web"]).Href,
                    CreatedOn = release.CreatedOn,
                    ReleaseStatus = release.Status.ToString(),
                    Description = release.Description,
                    Reason = release.Reason.ToString(),
                    BuildId = versionReference is null ? string.Empty : versionReference.Id,
                    BuildName = versionReference is null ? string.Empty : versionReference.Name,
                });
            }

            return releases;
        }

        public async Task<List<DeploymentLight>> GetReleaseDeployments(int releaseDefintionId, int releaseId)
        {
            List<DeploymentLight> deployments = new List<DeploymentLight>();

            ReleaseHttpClient releaseClient = connection.GetClient<ReleaseHttpClient>();
            List<Microsoft.VisualStudio.Services.ReleaseManagement.WebApi.Deployment> response = await releaseClient.GetDeploymentsAsync(projectName, releaseDefintionId);

            foreach (Microsoft.VisualStudio.Services.ReleaseManagement.WebApi.Deployment deployment in response)
            {
                if (deployment.Release.Id == releaseId)
                {
                    deployments.Add(new DeploymentLight()
                    {
                        Id = deployment.Id,
                        Name = deployment.ReleaseEnvironmentReference.Name,
                        DeploymentStatus = deployment.DeploymentStatus,
                        DeploymentOperationStatus = deployment.OperationStatus,
                        DeploymentReason = deployment.Reason.ToString(),
                        StartedOn = deployment.StartedOn,
                    });
                }
            }

            return deployments;
        }

        public async Task<List<DeploymentLight>> TriggerReleaseEnvironmentDeploy(int releaseId, string environmentName)
        {
            List<DeploymentLight> deployments = new List<DeploymentLight>();

            ReleaseHttpClient releaseClient = connection.GetClient<ReleaseHttpClient>();
            Release releaseExpand = await releaseClient.GetReleaseAsync(projectName, releaseId);

            ReleaseEnvironment? environmentToApprove = releaseExpand.Environments.FirstOrDefault(x => x.Name.Equals(environmentName, StringComparison.OrdinalIgnoreCase));

            if (environmentToApprove == null)
            {
                throw new Exception($"Environment {environmentName} not found in release {releaseId}");
            }

            string userName = Environment.UserName;
            ReleaseApproval approvalToModify = environmentToApprove.PreDeployApprovals[0];
            if (approvalToModify.Status != ApprovalStatus.Approved)
            {
                approvalToModify.Status = ApprovalStatus.Approved;
                approvalToModify.Comments = $"This environment deployment is triggered by [{userName.RemoveSpecialCharacters()}] using the Release Manager Tool";
                approvalToModify = await releaseClient.UpdateReleaseApprovalAsync(approvalToModify, projectName, approvalToModify.Id);
            }

            return deployments;
        }
    }
}
