using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.PackageRarityTypeDTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IPackageRarityTypeRepository
    {
        Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypesAsync();
        Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypeByPackageIdAsync(int id);
        Task<PackageRarityType> GetPackageRarityTypeByIdAsync(int packageId, int rarityTypeId);
        Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypeByRarityTypeIdAsync(int id);
        Task<PackageRarityType> AddPackageRarityTypeAsync(PackageRarityTypeDto PackageRarityType);
        Task<PackageRarityType> UpdatePackageRarityTypeAsync(PackageRarityTypeDto PackageRarityType);
        Task<PackageRarityType> DeletePackageRarityTypeAsync(PackageRarityTypeDeleteDto deleteDto);
        Task<bool> DeletePackageRarityTypesByPackageIdAsync(int packageId);

    }
}