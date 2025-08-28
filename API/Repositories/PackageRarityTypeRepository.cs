using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.PackageRarityTypeDTOs;
using API.Interfaces;
using API.Mappers;
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
            var rarityTypeId = packageRarityType.RarityTypeId;
            var packageId = packageRarityType.PackageId;
            var rarityType = await _context.RarityTypes.FirstOrDefaultAsync(r => r.Id == rarityTypeId && !r.Deleted) 
                ?? throw new Exception($"Rarity type with ID {rarityTypeId} not found.");

            var package = await _context.Packages.FirstOrDefaultAsync(p => p.Id == packageId && !p.Deleted)
                ?? throw new Exception($"Package with ID {packageId} not found.");

            // Check if the combination already exists
            var existingPackageRarityType = await _context.PackageRarityTypes
                .FirstOrDefaultAsync(pr => pr.PackageId == packageId &&
                                          pr.RarityTypeId == rarityTypeId && !pr.Deleted);

            if (existingPackageRarityType != null)
            {
                throw new Exception($"Package rarity type with PackageId {packageId} and RarityTypeId {rarityTypeId} already exists.");
            }

            var newPackageRarityType = packageRarityType.ToModel(packageId: packageId, rarityTypeId: rarityTypeId);

            await _context.PackageRarityTypes.AddAsync(newPackageRarityType);
            await _context.SaveChangesAsync();

            return newPackageRarityType;
        }

        public async Task<PackageRarityType> DeletePackageRarityTypeAsync(PackageRarityTypeDeleteDto deleteDto)
        {
            var packageId = deleteDto.PackageId;
            var rarityTypeId = deleteDto.RarityTypeId;

            var packageRarityType = await _context.PackageRarityTypes
                .FirstOrDefaultAsync(pr => pr.PackageId == packageId && pr.RarityTypeId == rarityTypeId && !pr.Deleted)
                ?? throw new Exception($"Package rarity type with PackageId {packageId} and RarityTypeId {rarityTypeId} not found.");

            packageRarityType.Deleted = true;
            await _context.SaveChangesAsync();

            return packageRarityType;

        }

        public async Task<bool> DeletePackageRarityTypesByPackageIdAsync(int packageId)
        {
            var package = await _context.Packages.FirstOrDefaultAsync(x => x.Id == packageId && !x.Deleted)
                ?? throw new Exception($"Package with Id of ${packageId} was not found!");

            var packageRarityTypes = await _context.PackageRarityTypes.ToListAsync();

            foreach (var packageRarityType in packageRarityTypes)
            {
                packageRarityType.Deleted = true;
            }

            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypeByPackageIdAsync(int id)
        {

            var packageRarityTypes = await _context.PackageRarityTypes
                .AsNoTracking()
                .Include(pr => pr.Package)
                .Include(pr => pr.RarityType)
                .Where(pr => pr.PackageId == id && pr.Deleted == false)
                .ToListAsync();

            return packageRarityTypes;

        }

        public async Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypeByRarityTypeIdAsync(int id)
        {

            var packageRarityTypes = await _context.PackageRarityTypes
                .AsNoTracking()
                .Include(pr => pr.Package)
                .Include(pr => pr.RarityType)
                .Where(pr => pr.RarityTypeId == id && pr.Deleted == false)
                .ToListAsync();

            return packageRarityTypes;
        }

        public async Task<IEnumerable<PackageRarityType>> GetAllPackageRarityTypesAsync()
        {

            var packageRarityTypes = await _context.PackageRarityTypes
                .AsNoTracking()
                .Include(pr => pr.Package)
                .Include(pr => pr.RarityType)
                .Where(pr => pr.Deleted == false)
                .ToListAsync();

            return packageRarityTypes;

        }

        public async Task<PackageRarityType> GetPackageRarityTypeByIdAsync(int packageId, int rarityTypeId)
        {

            var packageRarityType = await _context.PackageRarityTypes
                .AsNoTracking()
                .Include(pr => pr.Package)
                .Include(pr => pr.RarityType)
                .FirstOrDefaultAsync(pr => pr.PackageId == packageId && pr.RarityTypeId == rarityTypeId && pr.Deleted == false)
                ?? throw new Exception($"Package rarity type with PackageId {packageId} and RarityTypeId {rarityTypeId} not found.");

            return packageRarityType;

        }

        public async Task<PackageRarityType> UpdatePackageRarityTypeAsync(PackageRarityTypeDto packageRarityType)
        {
            var rarityTypeId = packageRarityType.RarityTypeId;
            var packageId = packageRarityType.PackageId;

            var packageRarityTypeToUpdate = await _context.PackageRarityTypes
                .Include(pr => pr.Package)
                .Include(pr => pr.RarityType)
                .FirstOrDefaultAsync(pr => pr.PackageId == packageId && pr.RarityTypeId == rarityTypeId && pr.Deleted == false)
                ?? throw new Exception($"Package rarity type with PackageId {packageId} and RarityTypeId {rarityTypeId} not found.");

            packageRarityTypeToUpdate.Ratio = packageRarityType.Ratio;
            await _context.SaveChangesAsync();

            return packageRarityTypeToUpdate;

        }
    }
}