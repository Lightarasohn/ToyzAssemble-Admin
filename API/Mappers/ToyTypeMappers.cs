using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyTypeDTOs;
using API.Models;

namespace API.Mappers
{
    public static class ToyTypeMappers
    {
        public static ToyTypeDto ToDto(this ToyType toyType)
        {
            return new ToyTypeDto
            {
                Name = toyType.Name,
            };
        }

        public static ToyType ToModel(this ToyTypeDto toyTypeDto)
        {
            return new ToyType
            {
                Name = toyTypeDto.Name,
            };
        }
    }
}