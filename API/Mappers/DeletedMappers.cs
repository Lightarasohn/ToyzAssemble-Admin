using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.DeletedDTOs;
using API.Models;

namespace API.Mappers
{
    public static class DeletedMappers
    {
        public static DeletedAllDto ToDTO(List<Toy> toys, List<Package> packages, List<RarityType> rarityTypes, List<ToyType> toyTypes)
        {
            return new DeletedAllDto
            {
                Toys = toys,
                ToyTypes = toyTypes,
                RarityTypes = rarityTypes,
                Packages = packages
            };
        }
    }
}