using System;
using System.Collections.Generic;

namespace API.Models;

public partial class Toy
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public int ToyTypeId { get; set; }

    public decimal LuckPercentage { get; set; }

    public int RarityId { get; set; }

    public bool Deleted { get; set; }

    public List<string>? ImageUrls { get; set; }

    public virtual RarityType Rarity { get; set; } = null!;

    public virtual ToyType ToyType { get; set; } = null!;
}
