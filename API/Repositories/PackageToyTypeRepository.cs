using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.PackageToyTypeDTOs;
using API.Interfaces;
using API.Models;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class PackageToyTypeRepository : IPackageToyTypeRepository
    {
        private readonly PostgresContext _context;
        
        public PackageToyTypeRepository(PostgresContext context)
        {
            _context = context;
        }
        public Task<PackageToyType> AddPackageToyTypeAsync(PackageToyTypeDto packageToyType)
        {
            try
            {
                var toyType = _context.ToyTypes.FirstOrDefault(t => t.Id == packageToyType.ToyTypeId)
                    ?? throw new Exception($"Toy type with ID {packageToyType.ToyTypeId} not found.");
                var package = _context.Packages.FirstOrDefault(p => p.Id == packageToyType.PackageId)
                    ?? throw new Exception($"Package with ID {packageToyType.PackageId} not found.");

                var newPackageToyType = new PackageToyType
                {
                    PackageId = packageToyType.PackageId,
                    ToyTypeId = packageToyType.ToyTypeId,
                    Ratio = packageToyType.Ratio,
                    Package = package,
                    ToyType = toyType
                };

                _context.PackageToyTypes.Add(newPackageToyType);
                _context.SaveChanges();

                return Task.FromResult(newPackageToyType);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding the package toy type.", ex);
            }
        }

        public Task<PackageToyType> DeletePackageToyTypeAsync(int packageId, int toyTypeId)
        {
            try
            {
                var packageToyType = _context.PackageToyTypes
                    .FirstOrDefault(pt => pt.PackageId == packageId && pt.ToyTypeId == toyTypeId)
                    ?? throw new Exception($"Package toy type with PackageId {packageId} and ToyTypeId {toyTypeId} not found.");

                _context.PackageToyTypes.Remove(packageToyType);
                _context.SaveChanges();

                return Task.FromResult(packageToyType);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the package toy type.", ex);
            }
        }

        public async Task<IEnumerable<PackageToyType>> GetAllPackageToyTypeByPackageIdAsync(int id)
        {
            try
            {
                var packageToyTypes = await _context.PackageToyTypes
                    .Include(pt => pt.Package)
                    .Include(pt => pt.ToyType)
                    .Where(pt => pt.PackageId == id)
                    .ToListAsync();

                return packageToyTypes;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving package toy types by PackageId.", ex);
            }
        }

        public async Task<IEnumerable<PackageToyType>> GetAllPackageToyTypeByToyTypeIdAsync(int id)
        {
            try
            {
                var packageToyTypes = await _context.PackageToyTypes
                    .Include(pt => pt.Package)
                    .Include(pt => pt.ToyType)
                    .Where(pt => pt.ToyTypeId == id)
                    .ToListAsync();

                return packageToyTypes;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving package toy types by ToyTypeId.", ex);
            }
        }

        public async Task<IEnumerable<PackageToyType>> GetAllPackageToyTypesAsync()
        {
            try
            {
                var package_toyTypes = await _context.PackageToyTypes.Include(x => x.Package)
                                                                      .Include(x => x.ToyType)
                                                                      .ToListAsync();
                return package_toyTypes;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving package toy types.", ex);
            }
        }

        public async Task<PackageToyType> GetPackageToyTypeByIdAsync(int packageId, int toyTypeId)
        {
            try
            {
                var packageToyType = await _context.PackageToyTypes
                    .Include(pt => pt.Package)
                    .Include(pt => pt.ToyType)
                    .FirstOrDefaultAsync(pt => pt.PackageId == packageId && pt.ToyTypeId == toyTypeId)
                    ?? throw new Exception($"Package toy type with PackageId {packageId} and ToyTypeId {toyTypeId} not found.");

                return packageToyType;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the package toy type with PackageId {packageId} and ToyTypeId {toyTypeId}.", ex);
            }
        }

        public Task<PackageToyType> UpdatePackageToyTypeAsync(PackageToyTypeDto packageToyType, int packageId, int toyTypeId)
        {
            try
            {
                var packageToyTypeToUpdate = _context.PackageToyTypes
                    .FirstOrDefault(pt => pt.PackageId == packageId && pt.ToyTypeId == toyTypeId)
                    ?? throw new Exception($"Package toy type with PackageId {packageId} and ToyTypeId {toyTypeId} not found.");
                var toyType = _context.ToyTypes.FirstOrDefault(t => t.Id == packageToyType.ToyTypeId)
                    ?? throw new Exception($"Toy type with ID {packageToyType.ToyTypeId} not found.");
                var package = _context.Packages.FirstOrDefault(p => p.Id == packageId)
                    ?? throw new Exception($"Package with ID {packageId} not found.");   

                packageToyTypeToUpdate.PackageId = packageId;
                packageToyTypeToUpdate.ToyTypeId = toyTypeId;
                packageToyTypeToUpdate.Ratio = packageToyType.Ratio;
                packageToyTypeToUpdate.Package = package;
                packageToyTypeToUpdate.ToyType = toyType;

                _context.PackageToyTypes.Update(packageToyTypeToUpdate);
                _context.SaveChanges();

                return Task.FromResult(packageToyTypeToUpdate);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the package toy type.", ex);
            }
        }
    }
}