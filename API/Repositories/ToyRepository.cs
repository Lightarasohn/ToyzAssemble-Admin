using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.ToyDTOs;
using API.Interfaces;
using API.Mappers;
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

            var newToy = toy.ToModel();
            var toyType = await _context.ToyTypes.FirstOrDefaultAsync(x => x.Id == toy.ToyTypeId && !x.Deleted)
             ?? throw new Exception("Toy type not found in the database.");

            var addedToy = await _context.Toys.AddAsync(newToy);
            await _context.SaveChangesAsync();
            return addedToy.Entity;

        }


        public async Task<Toy> DeleteToyAsync(int id)
        {

            var toy = await _context.Toys.FirstOrDefaultAsync(t => t.Id == id && t.Deleted == false)
             ?? throw new Exception("Toy could not found in the database");
            toy.Deleted = true;
            await _context.SaveChangesAsync();
            return toy;

        }

        public async Task<IEnumerable<Toy>> GetAllToysAsync()
        {

            var toys = await _context.Toys
                            .AsNoTracking()
                            .Include(x => x.ToyType)
                            .Include(x => x.Rarity)
                            .Where(t => t.Deleted == false)
                            .ToListAsync() ?? throw new Exception("No toys found in the database.");
            return toys;

        }

        public async Task<Toy> GetToyByIdAsync(int id)
        {

            var toy = await _context.Toys
                            .AsNoTracking()
                            .Include(x => x.ToyType)
                            .Include(x => x.Rarity)
                            .Where(t => t.Deleted == false)
                            .FirstOrDefaultAsync(t => t.Id == id) ?? throw new Exception($"Toy with ID {id} not found.");
            return toy;

        }

        public async Task<Toy> UpdateToyAsync(ToyDto toy, int id)
        {

            var foundToy = await _context.Toys
                            .Include(x => x.ToyType)
                            .Include(x => x.Rarity)
                            .Where(t => t.Deleted == false)
                            .FirstOrDefaultAsync(t => t.Id == id) ?? throw new Exception("Toy could not found in the database");
            foundToy.LuckPercentage = toy.LuckPercentage;
            foundToy.Name = toy.Name;
            foundToy.Price = toy.Price;

            var toyType = await _context.ToyTypes.FirstOrDefaultAsync(x => x.Id == toy.ToyTypeId && !x.Deleted)
             ?? throw new Exception("Toy type not found in the database.");
            foundToy.ToyTypeId = toy.ToyTypeId;
            foundToy.ToyType = toyType;

            var rarity = await _context.RarityTypes.FirstOrDefaultAsync(x => x.Id == toy.RarityId && !x.Deleted)
             ?? throw new Exception("Rarity not found in the database.");
            foundToy.RarityId = toy.RarityId;
            foundToy.Rarity = rarity;
            
            await _context.SaveChangesAsync();
            return foundToy;
        }
    }
}