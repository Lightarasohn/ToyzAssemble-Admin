using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.PackageDTOs;
using API.DTOs.RarityTypeDTOs;
using API.Models;

namespace API.Mappers
{
    public static class PackageMappers
    {
        public static Package ToModel(this PackageDto packageDto)
        {
            return new Package
            {
                Name = packageDto.Name,
                Price = packageDto.Price
            };
        }

        public static PackageDto ToDto(this Package package)
        {
            return new PackageDto
            {
                Name = package.Name,
                Price = package.Price
            };
        }
    }
}