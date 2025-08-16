using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.RarityTypeDTOs;
using API.Interfaces;
using API.Mappers;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class RarityTypeRepository : IRarityTypeRepository
    {
        private readonly PostgresContext _context;
        public RarityTypeRepository(PostgresContext context)
        {
            _context = context;
        }

        public async Task<RarityType> AddRarityTypeAsync(RarityTypeDto rarityTypeDto)
        {
            var existing = await _context.RarityTypes.AnyAsync(x => x.Name == rarityTypeDto.Name);
            if (existing) throw new Exception($"There is already a rarity type named: {rarityTypeDto.Name}");
            var rarityType = rarityTypeDto.ToModel();
            var addedRarityType = await _context.RarityTypes.AddAsync(rarityType);
            await _context.SaveChangesAsync();
            return addedRarityType.Entity;
        }

        public async Task<RarityType> DeleteRarityTypeAsync(int id)
        {
            var rarityType = await _context.RarityTypes.FirstOrDefaultAsync(x => x.Id == id)
                ?? throw new Exception($"The rarity type with id of {id} is not exist");
            rarityType.Deleted = true;
            await _context.SaveChangesAsync();
            return rarityType;
        }

        public async Task<IEnumerable<RarityType>> GetAllRarityTypesAsync()
        {
            return await _context.RarityTypes.AsNoTracking().Include(x => x.PackageRarityTypes).ToListAsync();
        }

        public async Task<RarityType> GetRarityTypeByIdAsync(int id)
        {
            return await _context.RarityTypes.FirstOrDefaultAsync(x => x.Id == id)
                ?? throw new Exception($"The rarity type with id of {id} is not exist");
        }

        public async Task<RarityType> UpdateRarityTypeAsync(RarityTypeDto rarityTypeDto, int id)
        {
            var rarityType = await _context.RarityTypes.FirstOrDefaultAsync(x => x.Id == id)
                ?? throw new Exception($"The rarity type with id of {id} is not exist");
            rarityType.Name = rarityTypeDto.Name;
            await _context.SaveChangesAsync();
            return rarityType;
        }
    }
}