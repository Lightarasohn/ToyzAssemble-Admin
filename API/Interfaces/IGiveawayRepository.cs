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
        Task<GiveawayPickedToyDto> PickToyFromPackageAsync(int packageId);
        PackageRarityType PickRarityTypeFromPackage(Package package);
        Toy PickToyFromRarityType(RarityType rarityType);
    }
}