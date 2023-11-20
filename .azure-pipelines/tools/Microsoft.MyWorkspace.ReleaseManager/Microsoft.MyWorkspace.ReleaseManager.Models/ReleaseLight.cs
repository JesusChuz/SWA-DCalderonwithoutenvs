// -----------------------------------------------------------------------
// <copyright file="ReleaseLight.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
//  </copyright>
// -----------------------------------------------------------------------

namespace Microsoft.MyWorkspace.ReleaseManager.Models
{
    public class ReleaseLight
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string ReleaseStatus { get; set; }

        public DateTime CreatedOn { get; set; }

        public string Url { get; set; }

        public string Description { get; set; }

        public string Reason { get; set; }

        public string BuildId { get; set; }

        public string BuildName { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}
