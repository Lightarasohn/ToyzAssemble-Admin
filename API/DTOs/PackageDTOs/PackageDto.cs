using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.PackageDTOs
{
    public class PackageDto
    {
        public string Name { get; set; } = null!;

        public decimal Price { get; set; }
    }
}