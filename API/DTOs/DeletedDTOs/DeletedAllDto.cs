using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;

namespace API.DTOs.DeletedDTOs
{
    public class DeletedAllDto
    {
        public List<Toy> Toys { get; set; } = new List<Toy>()!;
        public List<Package> Packages { get; set; } = new List<Package>()!;
        public List<ToyType> ToyTypes { get; set; } = new List<ToyType>()!;
        public List<RarityType> RarityTypes { get; set; } = new List<RarityType>()!;
        public List<PackageRarityType> PackageRarityTypes { get; set; } = new List<PackageRarityType>()!;
    }
}