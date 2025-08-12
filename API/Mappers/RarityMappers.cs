using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.RarityTypeDTOs;
using API.Models;

namespace API.Mappers
{
    public static class RarityMappers
    {
        public static RarityTypeDto ToDto(this RarityType rarityType)
        {
            return new RarityTypeDto
            {
                Name = rarityType.Name,
            };
        }

        public static RarityType ToModel(this RarityTypeDto rarityTypeDto)
        {
            return new RarityType
            {
                Name = rarityTypeDto.Name,
            };
        }
    }
}