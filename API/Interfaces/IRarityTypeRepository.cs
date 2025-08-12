using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.RarityTypeDTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IRarityTypeRepository
    {
        Task<IEnumerable<RarityType>> GetAllRarityTypesAsync();
        Task<RarityType> GetRarityTypeByIdAsync(int id);
        Task AddRarityTypeAsync(RarityTypeDto rarityTypeDto);
        Task UpdateRarityTypeAsync(RarityTypeDto rarityTypeDto, int id);
        Task DeleteRarityTypeAsync(int id);
    }
}