using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.GiveawayDTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IGiveawayRepository
    {
        public Task<GiveawayPickedToyDto> PickToyFromPackageAsync(int packageId);
        public PackageToyType PickToyTypeFromPackage(Package package);
        public Toy PickToyFromToyType(ToyType toyType);
    }
}