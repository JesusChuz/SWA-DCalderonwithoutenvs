// -----------------------------------------------------------------------
// <copyright file="DeploymentLight.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
//  </copyright>
// -----------------------------------------------------------------------

using Microsoft.VisualStudio.Services.ReleaseManagement.WebApi;

namespace Microsoft.MyWorkspace.ReleaseManager.Models
{
    public class DeploymentLight
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DeploymentStatus DeploymentStatus { get; set; }

        public DeploymentOperationStatus DeploymentOperationStatus { get; set; }

        public string DeploymentReason { get; set; }

        public DateTime StartedOn { get; set; }
    }
}
