using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.PackageDTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IPackageRepository
    {
        Task<IEnumerable<Package>> GetAllPackagesAsync();
        Task<Package> GetPackageByIdAsync(int id);
        Task<Package> AddPackageAsync(PackageDto package);
        Task<Package> UpdatePackageAsync(PackageDto package, int id);
        Task<Package> DeletePackageAsync(int id);
    }
}