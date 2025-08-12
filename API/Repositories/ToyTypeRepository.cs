using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.ToyTypeDTOs;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class ToyTypeRepository : IToyTypeRepository
    {
        private readonly PostgresContext _context;
        public ToyTypeRepository(PostgresContext context)
        {
            _context = context;
        }
        public async Task<ToyType> AddToyTypeAsync(ToyTypeDto toyType)
        {
            
                var newToyType = new ToyType
                {
                    Name = toyType.Name,
                };

                var addedToyType = await _context.ToyTypes.AddAsync(newToyType);
                await _context.SaveChangesAsync();
                return addedToyType.Entity;
            
        }

        public async Task<ToyType> DeleteToyTypeAsync(int id)
        {

                var toyType = await _context.ToyTypes.Include(t => t.Toys).FirstOrDefaultAsync(t => t.Id == id && t.Deleted == false) ?? throw new Exception($"Toy type with ID {id} not found.");
                toyType.Deleted = true;
                await _context.SaveChangesAsync();
                return toyType;
            
        }

        public async Task<IEnumerable<ToyType>> GetAllToyTypesAsync()
        {

                var toyTypes = await _context.ToyTypes
                                    .AsNoTracking()
                                    .Include(t => t.Toys)
                                    .Where(t => t.Deleted == false)
                                    .ToListAsync();
                return toyTypes;
            
        }

        public async Task<ToyType> GetToyTypeByIdAsync(int id)
        {

                var toyType = await _context.ToyTypes
                    .AsNoTracking()
                    .Include(t => t.Toys)
                    .FirstOrDefaultAsync(t => t.Id == id && t.Deleted == false)
                    ?? throw new Exception($"Toy type with ID {id} not found.");
                return toyType;
            
        }

        public async Task<ToyType> UpdateToyTypeAsync(ToyTypeDto toyType, int id)
        {
            
                var foundToyType = await _context.ToyTypes
                    .Include(t => t.Toys)
                    .FirstOrDefaultAsync(t => t.Id == id && t.Deleted == false)
                    ?? throw new Exception($"Toy type with ID {id} not found.");

                foundToyType.Name = toyType.Name;
                await _context.SaveChangesAsync();
                return foundToyType;
            
        }
    }
}