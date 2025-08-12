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
        PackageToyType PickToyTypeFromPackage(Package package);
        Toy PickToyFromToyType(ToyType toyType);
    }
}