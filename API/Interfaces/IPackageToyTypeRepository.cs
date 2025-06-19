using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.PackageToyTypeDTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IPackageToyTypeRepository
    {
        Task<IEnumerable<PackageToyType>> GetAllPackageToyTypesAsync();
        Task<IEnumerable<PackageToyType>> GetAllPackageToyTypeByPackageIdAsync(int id);
        Task<PackageToyType> GetPackageToyTypeByIdAsync(int packageId, int toyTypeId);
        Task<IEnumerable<PackageToyType>> GetAllPackageToyTypeByToyTypeIdAsync(int id);
        Task<PackageToyType> AddPackageToyTypeAsync(PackageToyTypeDto packageToyType);
        Task<PackageToyType> UpdatePackageToyTypeAsync(PackageToyTypeDto packageToyType, int packageId, int toyTypeId);
        Task<PackageToyType> DeletePackageToyTypeAsync(int packageId, int toyTypeId);
        
    }
}