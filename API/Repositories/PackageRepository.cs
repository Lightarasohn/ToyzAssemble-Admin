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
            try
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
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding the package.", ex);
            }
        }

        public async Task<Package> DeletePackageAsync(int id)
        {
            try
            {
                var package = await _context.Packages.Include(p => p.PackageToyTypes).FirstOrDefaultAsync(p => p.Id == id) ?? throw new Exception($"Package with ID {id} not found.");
                if (package.PackageToyTypes != null && package.PackageToyTypes.Any())
                {
                    _context.PackageToyTypes.RemoveRange(package.PackageToyTypes);
                }
                _context.Packages.Remove(package);
                await _context.SaveChangesAsync();
                return package;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the package.", ex);
            }
        }

        public async Task<IEnumerable<Package>> GetAllPackagesAsync()
        {
            try
            {
                var packages = await _context.Packages
                    .Include(t => t.PackageToyTypes)
                    .ThenInclude(pt => pt.ToyType)
                    .ThenInclude(t => t.Toys)
                    .ToListAsync();

                return packages;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving all packages.", ex);
            }
        }

        public async Task<Package> GetPackageByIdAsync(int id)
        {
            try
            {
                var package = await _context.Packages.
                Include(x => x.PackageToyTypes)
                .ThenInclude(pt => pt.ToyType)
                .ThenInclude(x => x.Toys)
                .FirstOrDefaultAsync(x => x.Id == id) ?? throw new Exception($"Package with ID {id} not found.");
                return package;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the package with ID {id}.", ex);
            }
        }

        public async Task<Package> UpdatePackageAsync(PackageDto package, int id)
        {
            try
            {
                var packageToUpdate = await _context.Packages.Include(x => x.PackageToyTypes).FirstOrDefaultAsync(x => x.Id == id) ?? throw new Exception($"Package with ID {id} not found.");

                packageToUpdate.Name = package.Name;
                packageToUpdate.Price = package.Price;

                await _context.SaveChangesAsync();
                return packageToUpdate;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the package.", ex);
            }
        }
    }
}