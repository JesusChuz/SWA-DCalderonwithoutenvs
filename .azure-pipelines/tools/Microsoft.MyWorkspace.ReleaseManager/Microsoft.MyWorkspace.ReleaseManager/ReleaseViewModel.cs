// -----------------------------------------------------------------------
// <copyright file="ReleaseViewModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
//  </copyright>
// -----------------------------------------------------------------------

namespace Microsoft.MyWorkspace.ReleaseManager
{
    public class ReleaseViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public ReleaseDefinitionViewModel Definition { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}
