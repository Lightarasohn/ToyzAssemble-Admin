using System;
using System.Collections.Generic;

namespace API.Models;

public partial class Package
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public virtual ICollection<PackageToyType> PackageToyTypes { get; set; } = new List<PackageToyType>();
}
