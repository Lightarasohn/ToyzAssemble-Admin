using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.DeletedDTOs;
using API.Interfaces;
using API.Mappers;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Services
{
    public class DeletedService : IDeletedService
    {
        private readonly PostgresContext _context;
        public DeletedService(PostgresContext context)
        {
            _context = context;
        }
        public async Task<DeletedAllDto> GetAllDeletedAsync()
        {
            var deletedToys = await GetAllDeletedToys();
            var deletedPackages = await GetAllDeletedPackages();
            var deletedRarityTypes = await GetAllDeletedRarityTypes();
            var deletedToyTypes = await GetAllDeletedToyTypes();
            var allDeletedDto = DeletedMappers.ToDTO(deletedToys, deletedPackages, deletedRarityTypes, deletedToyTypes);
            return allDeletedDto;
        }

        private async Task<List<Toy>> GetAllDeletedToys()
        {
            return await _context.Toys.AsNoTracking().Where(t => t.Deleted).ToListAsync();
        }

        private async Task<List<Package>> GetAllDeletedPackages()
        {
            return await _context.Packages.AsNoTracking().Where(p => p.Deleted).ToListAsync();
        }

        private async Task<List<ToyType>> GetAllDeletedToyTypes()
        {
            return await _context.ToyTypes.AsNoTracking().Where(tt => tt.Deleted).ToListAsync();
        }

        private async Task<List<RarityType>> GetAllDeletedRarityTypes()
        {
            return await _context.RarityTypes.AsNoTracking().Where(rt => rt.Deleted).ToListAsync();
        }

        public async Task<bool> UnDeleteAsync(UnDeleteDTO unDeleteDTO)
        {
            switch (unDeleteDTO.TableName.ToLower())
            {
                case "toys":
                    {
                        var toy = await _context.Toys
                            .FirstOrDefaultAsync(t => t.Id == unDeleteDTO.Id)
                            ?? throw new InvalidOperationException($"Toy with Id {unDeleteDTO.Id} not found");

                        toy.Deleted = false;
                        break;
                    }
                case "packages":
                    {
                        var package = await _context.Packages
                            .FirstOrDefaultAsync(p => p.Id == unDeleteDTO.Id)
                            ?? throw new InvalidOperationException($"Package with Id {unDeleteDTO.Id} not found");

                        package.Deleted = false;
                        break;
                    }
                case "raritytypes":
                    {
                        var rarity = await _context.RarityTypes
                            .FirstOrDefaultAsync(r => r.Id == unDeleteDTO.Id)
                            ?? throw new InvalidOperationException($"RarityType with Id {unDeleteDTO.Id} not found");

                        rarity.Deleted = false;
                        break;
                    }
                case "toytypes":
                    {
                        var toyType = await _context.ToyTypes
                            .FirstOrDefaultAsync(tt => tt.Id == unDeleteDTO.Id)
                            ?? throw new InvalidOperationException($"ToyType with Id {unDeleteDTO.Id} not found");

                        toyType.Deleted = false;
                        break;
                    }
                case "packages-raritytypes":
                    {
                        var packagesRarityTypes = await _context.PackageRarityTypes
                            .FirstOrDefaultAsync(prt =>
                            prt.PackageId == unDeleteDTO.PackageRarityTypeDto.PackageId &&
                            prt.RarityTypeId == unDeleteDTO.PackageRarityTypeDto.RarityTypeId)
                            ?? throw new InvalidOperationException($"PackageRarityType with packageId {unDeleteDTO.PackageRarityTypeDto.PackageId} and rarityTypeId {unDeleteDTO.PackageRarityTypeDto.RarityTypeId} not found");
                        break;
                    }
                default:
                    throw new ArgumentException($"Invalid table name: {unDeleteDTO.TableName}");
            }

            await _context.SaveChangesAsync();
            return true;
        }

    }
}