using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;

namespace API.DTOs.ToyDTOs
{
    public class ToyRandomDto
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
}