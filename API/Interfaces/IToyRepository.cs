using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyDTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IToyRepository
    {
        Task<IEnumerable<Toy>> GetAllToysAsync();
        Task<Toy> GetToyByIdAsync(int id);

        /// <summary>
        /// Adds a new toy to the database.
        /// </summary>
        /// <param name="toy"></param>
        /// <returns>Task Toy</returns>
        /// <exception cref="Exception"></exception>
        Task<Toy> AddToyAsync(ToyDto toy);
        Task<Toy> UpdateToyAsync(ToyDto toy, int id);
        Task<Toy> DeleteToyAsync(int id);
    }
}