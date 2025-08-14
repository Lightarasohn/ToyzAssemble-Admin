using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.ToyDTOs;
using API.Interfaces;
using API.Models;

namespace API.Services
{
    public class ToyService : IToyService
    {
        private readonly PostgresContext _context;
        public ToyService(PostgresContext context)
        {
            _context = context;
        }
        public async Task<List<Toy>> UpdateRangeToyList(ToyUpdateListServiceDto updateDtoList)
        {
            var returnToyList = new List<Toy>();
            foreach (int toyId in updateDtoList.IdList)
            {
                var toy = FindToy(toyId);
                if (toy == null) continue;
                var updateDto = updateDtoList.UpdateDto;
                toy.LuckPercentage = updateDto.LuckPercentage;
                toy.Price = updateDto.Price;
                toy.RarityId = updateDto.RarityId;
                toy.ToyTypeId = updateDto.ToyTypeId;
                returnToyList.Add(toy);
            }

            await _context.SaveChangesAsync();
            return returnToyList;
        }

        private Toy? FindToy(int id)
        {
            return _context.Toys.FirstOrDefault(t => t.Id == id); 
        }
    }
}