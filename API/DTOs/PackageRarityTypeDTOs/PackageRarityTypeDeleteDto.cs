using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.PackageRarityTypeDTOs
{
    public class PackageRarityTypeDeleteDto
    {
        public int PackageId { get; set; }
        public int RarityTypeId { get; set; }
    }
}