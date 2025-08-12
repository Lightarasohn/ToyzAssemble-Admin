using System;
using System.Collections.Generic;

namespace API.Models;

public partial class Package
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public bool Deleted { get; set; }

    public virtual ICollection<PackageRarityType> PackageRarityTypes { get; set; } = new List<PackageRarityType>();
}
