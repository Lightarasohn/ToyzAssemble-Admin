using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
    }
}