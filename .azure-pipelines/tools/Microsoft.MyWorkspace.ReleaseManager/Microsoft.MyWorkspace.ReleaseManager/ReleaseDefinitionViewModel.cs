// -----------------------------------------------------------------------
// <copyright file="ReleaseDefinitionViewModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
//  </copyright>
// -----------------------------------------------------------------------

using Microsoft.MyWorkspace.ReleaseManager.Models;
using System.Collections.Generic;
using System.ComponentModel;

namespace Microsoft.MyWorkspace.ReleaseManager
{
    public class ReleaseDefinitionViewModel : INotifyPropertyChanged 
    {
        public string Name { get; set; } = string.Empty;

        public string CurrentVersion { get; set; } = string.Empty;

        public bool ShouldBePerformed { get; set; }

        private string _status = "-";
        public string Status
        {
            get => _status;
            set
            {
                _status = value;
                if (PropertyChanged is not null)
                {
                    PropertyChanged(this, new PropertyChangedEventArgs(nameof(Status)));
                }
            }
        }

        public int TotalRunningPods { get; set; }

        public int TotalDeployedPods { get; set; }

        public int Id { get; internal set; }

        public IEnumerable<ReleaseViewModel> Releases { get; set; } = new List<ReleaseViewModel>();

        public ReleaseViewModel SelectedRelease { get; set; }

        public IEnumerable<DeploymentLight> Environments { get; internal set; }

        public event PropertyChangedEventHandler? PropertyChanged;
    }
}
