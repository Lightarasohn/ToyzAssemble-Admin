using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.ToyDTOs
{
    public class ToyUpdateServiceDto
    {
        public decimal Price { get; set; }

        public int ToyTypeId { get; set; }

        public decimal LuckPercentage { get; set; }

        public int RarityId { get; set; }
    }
}