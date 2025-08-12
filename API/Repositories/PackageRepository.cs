using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.PackageDTOs;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class PackageRepository : IPackageRepository
    {
        private readonly PostgresContext _context;
        public PackageRepository(PostgresContext context)
        {
            _context = context;
        }
        public async Task<Package> AddPackageAsync(PackageDto package)
        {
            
                var newPackage = new Package
                {
                    Name = package.Name,
                    Price = package.Price
                };

                _context.Packages.Add(newPackage);
                await _context.SaveChangesAsync();

                return newPackage;
            
        }

        public async Task<Package> DeletePackageAsync(int id)
        {
            
                var package = await _context.Packages
                                    .Include(p => p.PackageRarityTypes)
                                    .FirstOrDefaultAsync(p => p.Id == id && p.Deleted == false) ?? throw new Exception($"Package with ID {id} not found.");
                package.Deleted = true;
                await _context.SaveChangesAsync();
                return package;
           
        }

        public async Task<IEnumerable<Package>> GetAllPackagesAsync()
        {
            
                var packages = await _context.Packages
                    .AsNoTracking()
                    .Where(p => p.Deleted == false)
                    .Include(t => t.PackageRarityTypes)
                    .ThenInclude(pt => pt.RarityType)
                    .ThenInclude(t => t.Toys)
                    .ToListAsync();

                return packages;
           
        }

        public async Task<Package> GetPackageByIdAsync(int id)
        {
            
                var package = await _context.Packages
                .AsNoTracking()
                .Include(x => x.PackageRarityTypes)
                .ThenInclude(pt => pt.RarityType)
                .ThenInclude(x => x.Toys)
                .FirstOrDefaultAsync(x => x.Id == id && x.Deleted == false) ?? throw new Exception($"Package with ID {id} not found.");
                return package;
           
        }

        public async Task<Package> UpdatePackageAsync(PackageDto package, int id)
        {
            
                var packageToUpdate = await _context.Packages
                    .Include(x => x.PackageRarityTypes)
                    .FirstOrDefaultAsync(x => x.Id == id && x.Deleted == false) ?? throw new Exception($"Package with ID {id} not found.");

                packageToUpdate.Name = package.Name;
                packageToUpdate.Price = package.Price;

                await _context.SaveChangesAsync();
                return packageToUpdate;
             
        }
    }
}