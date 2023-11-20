// -----------------------------------------------------------------------
// <copyright file="Release.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
//  </copyright>
// -----------------------------------------------------------------------

using System.Collections.Generic;

namespace Microsoft.MyWorkspace.ReleaseManager
{
    internal class Release
    {
        public string Name { get; set; } = string.Empty;

        public string CurrentVersion { get; set; } = string.Empty;

        public List<string> Versions { get; set; } = new List<string>();

        public bool ShouldBePerformed { get; set; }

        public string Status { get; set; } = "Deployed";

        public int TotalRunningPods { get; set; }

        public int TotalDeployedPods { get; set; }
    }
}
