using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyTypeDTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IToyTypeRepository
    {
        Task<IEnumerable<ToyType>> GetAllToyTypesAsync();
        Task<ToyType> GetToyTypeByIdAsync(int id);
        Task<ToyType> AddToyTypeAsync(ToyTypeDto toyType);
        Task<ToyType> UpdateToyTypeAsync(ToyTypeDto toyType, int id);
        Task<ToyType> DeleteToyTypeAsync(int id);
    }
}