using System;
using System.Collections.Generic;

namespace API.Models;

public partial class PackageRarityType
{
    public int PackageId { get; set; }

    public int RarityTypeId { get; set; }

    public double Ratio { get; set; }

    public bool Deleted { get; set; }

    public virtual Package Package { get; set; } = null!;

    public virtual RarityType RarityType { get; set; } = null!;
}
