using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.DeletedDTOs
{
    public class UnDeleteDTO
    {
        public string TableName { get; set; } = string.Empty!;
        public int Id { get; set; }
        public UnDeletePackageRarityTypeDto PackageRarityTypeDto { get; set; } = new()!;
    }
}