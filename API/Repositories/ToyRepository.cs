using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.ToyDTOs;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class ToyRepository : IToyRepository
    {
        private readonly PostgresContext _context;
        public ToyRepository(PostgresContext context)
        {
            _context = context;
        }


        public async Task<Toy> AddToyAsync(ToyDto toy)
        {
            try
            {
                var newToy = new Toy
                {
                    Name = toy.Name,
                    Price = toy.Price,
                    LuckPercentage = toy.LuckPercentage,
                };
                var toyType = await _context.ToyTypes.FirstOrDefaultAsync(x => x.Id == toy.ToyTypeId);
                if (toyType != null)
                {
                    newToy.ToyTypeId = toy.ToyTypeId;
                    newToy.ToyType = toyType;
                }
                else
                {
                    throw new Exception("Toy type not found in the database.");
                }

                var addedToy = await _context.AddAsync(newToy);
                await _context.SaveChangesAsync();
                return addedToy.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving toys.", ex);
            }
        }


        public async Task<Toy> DeleteToyAsync(int id)
        {
            try
            {
                var toy = await _context.Toys.Include(x => x.ToyType).FirstOrDefaultAsync(t => t.Id == id) ?? throw new Exception("Toy could not found in the database");
                _context.Remove(toy);
                await _context.SaveChangesAsync();
                return toy;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving toys.", ex);
            }
        }

        public async Task<IEnumerable<Toy>> GetAllToysAsync()
        {
            try
            {
                var toys = await _context.Toys.Include(x => x.ToyType).ToListAsync() ?? throw new Exception("No toys found in the database.");
                return toys;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving toys.", ex);
            }
        }

        public async Task<Toy> GetToyByIdAsync(int id)
        {
            try
            {
                var toy = await _context.Toys.Include(x => x.ToyType).FirstOrDefaultAsync(t => t.Id == id) ?? throw new Exception($"Toy with ID {id} not found.");
                return toy;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the toy.", ex);
            }
        }

        public async Task<Toy> UpdateToyAsync(ToyDto toy, int id)
        {
            try
            {
                var foundToy = await _context.Toys.Include(x => x.ToyType).FirstOrDefaultAsync(t => t.Id == id) ?? throw new Exception("Toy could not found in the database");
                foundToy.LuckPercentage = toy.LuckPercentage;
                foundToy.Name = toy.Name;
                foundToy.Price = toy.Price;
                var toyType = await _context.ToyTypes.FirstOrDefaultAsync(x => x.Id == toy.ToyTypeId);
                if (toyType != null)
                {
                    foundToy.ToyTypeId = toy.ToyTypeId;
                    foundToy.ToyType = toyType;
                }
                await _context.SaveChangesAsync();
                return foundToy;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving toys.", ex);
            }
        }
    }
}