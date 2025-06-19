using System;
using System.Collections.Generic;

namespace API.Models;

public partial class PackageToyType
{
    public int PackageId { get; set; }

    public int ToyTypeId { get; set; }

    public decimal Ratio { get; set; }

    public virtual Package Package { get; set; } = null!;

    public virtual ToyType ToyType { get; set; } = null!;
}
