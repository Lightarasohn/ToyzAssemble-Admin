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
            try
            {
                var newToyType = new ToyType
                {
                    Name = toyType.Name,
                };

                var addedToyType = await _context.ToyTypes.AddAsync(newToyType);
                await _context.SaveChangesAsync();
                return addedToyType.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding the toy type.", ex);
            }
        }

        public async Task<ToyType> DeleteToyTypeAsync(int id)
        {
            try
            {
                var toyType = await _context.ToyTypes.Include(t => t.Toys).FirstOrDefaultAsync(t => t.Id == id) ?? throw new Exception($"Toy type with ID {id} not found.");
                _context.ToyTypes.Remove(toyType);
                await _context.SaveChangesAsync();
                return toyType;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the toy type.", ex);
            }
        }

        public async Task<IEnumerable<ToyType>> GetAllToyTypesAsync()
        {
            try
            {
                var toyTypes = await _context.ToyTypes.Include(t => t.Toys).Include(t => t.PackageToyTypes).ToListAsync();
                return toyTypes;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving toy types.", ex);
            }
        }

        public async Task<ToyType> GetToyTypeByIdAsync(int id)
        {
            try
            {
                var toyType = await _context.ToyTypes.Include(t => t.Toys).Include(t => t.PackageToyTypes).FirstOrDefaultAsync(t => t.Id == id) ?? throw new Exception($"Toy type with ID {id} not found.");
                return toyType;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the toy type.", ex);
            }
        }

        public async Task<ToyType> UpdateToyTypeAsync(ToyTypeDto toyType, int id)
        {
            try
            {
                var foundToyType = await _context.ToyTypes.Include(t => t.Toys).FirstOrDefaultAsync(t => t.Id == id) ?? throw new Exception($"Toy type with ID {id} not found.");

                foundToyType.Name = toyType.Name;
                await _context.SaveChangesAsync();
                return foundToyType;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the toy type.", ex);
            }
        }
    }
}