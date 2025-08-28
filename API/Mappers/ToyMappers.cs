using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyDTOs;
using API.Models;

namespace API.Mappers
{
    public static class ToyMappers
    {
        public static ToyDto ToDto(this Toy toy)
        {
            return new ToyDto
            {
                Name = toy.Name,
                Price = toy.Price,
                LuckPercentage = toy.LuckPercentage,
                ToyTypeId = toy.ToyTypeId,
                RarityId = toy.RarityId
            };
        }

        public static Toy ToModel(this ToyDto toyDto)
        {
            return new Toy
            {
                Name = toyDto.Name,
                Price = toyDto.Price,
                LuckPercentage = toyDto.LuckPercentage,
                ToyTypeId = toyDto.ToyTypeId,
                RarityId = toyDto.RarityId
            };
        }

        public static ToyRandomDto ToRandomDto(this Toy toy, ToyType toyType, RarityType rarityType)
        {
            return new ToyRandomDto
            {
                Id = toy.Id,
                Name = toy.Name,
                Price = toy.Price,
                LuckPercentage = toy.LuckPercentage,
                ToyTypeId = toy.ToyTypeId,
                RarityId = toy.RarityId,
                Deleted = toy.Deleted,
                ImageUrls = toy.ImageUrls,
                Rarity = rarityType,
                ToyType = toyType
            };
        }
    }
}