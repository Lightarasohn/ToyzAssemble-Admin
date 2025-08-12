using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.PackageRarityTypeDTOs;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class PackageRarityTypeRepository : IPackageRarityTypeRepository
    {
        private readonly PostgresContext _context;

        public PackageRarityTypeRepository(PostgresContext context)
        {
            _context = context;
        }

        public async Task<PackageRarityType> AddPackageRarityTypeAsync(PackageRarityTypeDto packageRarityType)
        {

            var rarityType = await _context.RarityTypes.FirstOrDefaultAsync(r => r.Id == packageRarityType.RarityTypeId)
                ?? throw new Exception($"Rarity type with ID {packageRarityType.RarityTypeId} not found.");

            var package = await _context.Packages.FirstOrDefaultAsync(p => p.Id == packageRarityType.PackageId)
                ?? throw new Exception($"Package with ID {packageRarityType.PackageId} not found.");

            // Check if the combination already exists
            var existingPackageRarityType = await _context.PackageRarityTypes
                .FirstOrDefaultAsync(pr => pr.PackageId == packageRarityType.PackageId &&
                                          pr.RarityTypeId == packageRarityType.RarityTypeId);

            if (existingPackageRarityType != null)
            {
                throw new Exception($"Package rarity type with PackageId {packageRarityType.PackageId} and RarityTypeId {packageRarityType.RarityTypeId} already exists.");
            }

            var newPackageRarityType = new PackageRarityType
            {
                PackageId = packageRarityType.PackageId,
                RarityTypeId = packageRarityType.RarityTypeId,
                Ratio = packageRarityType.Ratio,
                Package = package,
                RarityType = rarityType
            };

            _context.PackageRarityTypes.Add(newPackageRarityType);
            await _context.SaveChangesAsync();

            return newPackageRarityType;
        }

        public async Task<PackageRarityType> DeletePackageRarityTypeAsync(int packageId, int rarityTypeId)
        {
            
                var packageRarityType = await _context.PackageRarityTypes
                    .Include(pr => pr.Package)
                    .Include(pr => pr.RarityType)
                    .FirstOrDefaultAsync(pr => pr.PackageId == packageId && pr.RarityTypeId == rarityTypeId)
                    ?? throw new Exception($"Package rarity type with PackageId {packageId} and RarityTypeId {rarityTypeId} not found.");

                _context.PackageRarityTypes.Remove(packageRarityType);
                await _context.SaveChangesAsync();

                return packageRarityType;
            
        }

        public async Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypeByPackageIdAsync(int id)
        {
            
                var packageRarityTypes = await _context.PackageRarityTypes
                    .Include(pr => pr.Package)
                    .Include(pr => pr.RarityType)
                    .Where(pr => pr.PackageId == id)
                    .ToListAsync();

                return packageRarityTypes;
            
        }

        public async Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypeByRarityTypeIdAsync(int id)
        {
            
                var packageRarityTypes = await _context.PackageRarityTypes
                    .Include(pr => pr.Package)
                    .Include(pr => pr.RarityType)
                    .Where(pr => pr.RarityTypeId == id)
                    .ToListAsync();

                return packageRarityTypes;
        }

        public async Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypesAsync()
        {
            
                var packageRarityTypes = await _context.PackageRarityTypes
                    .Include(pr => pr.Package)
                    .Include(pr => pr.RarityType)
                    .ToListAsync();
                
                return packageRarityTypes;
            
        }

        public async Task<PackageRarityType> GetPackageRarityTypeByIdAsync(int packageId, int rarityTypeId)
        {
            
                var packageRarityType = await _context.PackageRarityTypes
                    .Include(pr => pr.Package)
                    .Include(pr => pr.RarityType)
                    .FirstOrDefaultAsync(pr => pr.PackageId == packageId && pr.RarityTypeId == rarityTypeId)
                    ?? throw new Exception($"Package rarity type with PackageId {packageId} and RarityTypeId {rarityTypeId} not found.");

                return packageRarityType;
            
        }

        public async Task<PackageRarityType> UpdatePackageRarityTypeAsync(PackageRarityTypeDto packageRarityType, int packageId, int rarityTypeId)
        {
            
                var packageRarityTypeToUpdate = await _context.PackageRarityTypes
                    .Include(pr => pr.Package)
                    .Include(pr => pr.RarityType)
                    .FirstOrDefaultAsync(pr => pr.PackageId == packageId && pr.RarityTypeId == rarityTypeId)
                    ?? throw new Exception($"Package rarity type with PackageId {packageId} and RarityTypeId {rarityTypeId} not found.");

                // If the new IDs are different from current ones, validate they exist
                if (packageRarityType.RarityTypeId != rarityTypeId)
                {
                    var newRarityType = await _context.RarityTypes.FirstOrDefaultAsync(r => r.Id == packageRarityType.RarityTypeId)
                        ?? throw new Exception($"Rarity type with ID {packageRarityType.RarityTypeId} not found.");
                    packageRarityTypeToUpdate.RarityType = newRarityType;
                    packageRarityTypeToUpdate.RarityTypeId = packageRarityType.RarityTypeId;
                }

                if (packageRarityType.PackageId != packageId)
                {
                    var newPackage = await _context.Packages.FirstOrDefaultAsync(p => p.Id == packageRarityType.PackageId)
                        ?? throw new Exception($"Package with ID {packageRarityType.PackageId} not found.");
                    packageRarityTypeToUpdate.Package = newPackage;
                    packageRarityTypeToUpdate.PackageId = packageRarityType.PackageId;
                }

                // Update the ratio
                packageRarityTypeToUpdate.Ratio = packageRarityType.Ratio;

                _context.PackageRarityTypes.Update(packageRarityTypeToUpdate);
                await _context.SaveChangesAsync();

                return packageRarityTypeToUpdate;
           
        }
    }
}