using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.RarityTypeDTOs;
using API.Interfaces;
using API.Mappers;
using API.Models;

namespace API.Repositories
{
    public class RarityTypeRepository : IRarityTypeRepository
    {
        private readonly PostgresContext _context;
        public RarityTypeRepository(PostgresContext context)
        {
            _context = context;
        }

        public async Task AddRarityTypeAsync(RarityTypeDto rarityTypeDto)
        {
            var rarityType = rarityTypeDto.ToModel();
            await _context.RarityTypes.AddAsync(rarityType);
            await _context.SaveChangesAsync();
        }

        public Task DeleteRarityTypeAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RarityType>> GetAllRarityTypesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<RarityType> GetRarityTypeByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateRarityTypeAsync(RarityTypeDto rarityTypeDto, int id)
        {
            throw new NotImplementedException();
        }
    }
}