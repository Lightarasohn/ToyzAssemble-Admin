using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyDTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IToyService
    {
        Task<List<Toy>> UpdateRangeToyList(ToyUpdateListServiceDto updateDtoList);
    }
}