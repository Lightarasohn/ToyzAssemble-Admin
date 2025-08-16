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
            var toys = _context.Toys.Where(t => updateDtoList.IdList.Contains(t.Id) && t.Deleted == false).ToList();
            var updateDto = updateDtoList.UpdateDto;

            foreach (var toy in toys)
            {
                toy.LuckPercentage = updateDto.LuckPercentage ?? toy.LuckPercentage;
                toy.Price = updateDto.Price ?? toy.Price;
                toy.RarityId = updateDto.RarityTypeId ?? toy.RarityId;
                toy.ToyTypeId = updateDto.ToyTypeId ?? toy.ToyTypeId;
            }

            await _context.SaveChangesAsync();
            return toys;
        }
    }
}