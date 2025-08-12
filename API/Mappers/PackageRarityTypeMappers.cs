using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.PackageRarityTypeDTOs;
using API.DTOs.RarityTypeDTOs;
using API.Models;

namespace API.Mappers
{
    public static class PackageRarityTypeMappers
    {
        public static PackageRarityTypeDto ToDto(this PackageRarityType packageRarityType)
        {
            return new PackageRarityTypeDto
            {
                Ratio = packageRarityType.Ratio,
            };
        }

        public static PackageRarityType ToModel(this PackageRarityTypeDto packageRarityTypeDto, int packageId, int rarityTypeId)
        {
            return new PackageRarityType
            {
                Ratio = packageRarityTypeDto.Ratio,
                PackageId = packageId,
                RarityTypeId = rarityTypeId
            };
        }
    }
}