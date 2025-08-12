using System;
using System.Collections.Generic;

namespace API.Models;

public partial class ToyType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool Deleted { get; set; }

    public virtual ICollection<Toy> Toys { get; set; } = new List<Toy>();
}
