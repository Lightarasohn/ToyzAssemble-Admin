using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.DeletedDTOs;

namespace API.Interfaces
{
    public interface IDeletedService
    {
        public Task<DeletedAllDto> GetAllDeletedAsync();
        public Task<bool> UnDeleteAsync(UnDeleteDTO unDeleteDTO);
    }
}