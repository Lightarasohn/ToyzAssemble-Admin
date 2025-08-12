using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;

namespace API.DTOs.ToyDTOs
{
    public class ToyDto
    {
        public string Name { get; set; } = null!;

        public decimal Price { get; set; }

        public int ToyTypeId { get; set; }

        public decimal LuckPercentage { get; set; }

        public int RarityId { get; set; }

    }
}