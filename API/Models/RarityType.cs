using System;
using System.Collections.Generic;

namespace API.Models;

public partial class RarityType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<PackageRarityType> PackageRarityTypes { get; set; } = new List<PackageRarityType>();

    public virtual ICollection<Toy> Toys { get; set; } = new List<Toy>();
}
