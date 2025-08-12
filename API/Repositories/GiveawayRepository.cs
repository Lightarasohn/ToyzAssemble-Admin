using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.GiveawayDTOs;
using API.Interfaces;
using API.Models;

namespace API.Repositories
{
    public class GiveawayRepository : IGiveawayRepository
    {
        private readonly IPackageRepository _packageRepository;
        private readonly ILogger<GiveawayRepository> _logger;
        public GiveawayRepository(IPackageRepository packageRepository, ILogger<GiveawayRepository> logger)
        {
            _packageRepository = packageRepository;
            _logger = logger;
        }

        public PackageToyType PickToyTypeFromPackage(Package package)
        {
            var packageToyTypes = package.PackageToyTypes ?? throw new Exception("Package has no toy types");

            float totalProbability = packageToyTypes.Sum(pt => (float)pt.Ratio);
            if (totalProbability <= 0) throw new Exception("Total probability of toy types in package is zero or negative");

            float ratioConvertRate = 100f / totalProbability;
            var random = new Random();
            float roll = (float)(random.NextDouble() * 100);
            float cumulative = 0f;

            foreach (var pt in packageToyTypes)
            {
            cumulative += (float)pt.Ratio * ratioConvertRate;
            if (roll < cumulative)
            {
                _logger.LogInformation($"Picked toy type: {pt.ToyType} with ratio {pt.Ratio}");
                return pt;
            }
            }

            // Fallback to last if none picked due to floating point errors
            var fallback = packageToyTypes.Last();
            _logger.LogInformation($"Picked toy type (fallback): {fallback.ToyType} with ratio {fallback.Ratio}");
            return fallback;
        }

        public Toy PickToyFromToyType(ToyType toyType)
        {
            var toys = toyType.Toys ?? throw new Exception("Toy type has no toys");
            float totalProbability = toys.Sum(t => (float)t.LuckPercentage);
            if (totalProbability <= 0) throw new Exception("Total probability of toys in toy type is zero or negative");

            float ratioConvertRate = 100f / totalProbability;
            var random = new Random();
            float roll = (float)(random.NextDouble() * 100);
            float cumulative = 0f;

            foreach (var toy in toys)
            {
                cumulative += (float)toy.LuckPercentage * ratioConvertRate;
                if (roll < cumulative)
                {
                    return toy;
                }
            }

            // Fallback to last if none picked due to floating point errors
            return toys.Last();
        }

        public async Task<GiveawayPickedToyDto> PickToyFromPackageAsync(int packageId)
        {
            var package = await _packageRepository.GetPackageByIdAsync(packageId) ?? throw new Exception("Package not found");
            if (package.PackageToyTypes.Count == 0) throw new Exception("Package has no toys");

            _logger.LogInformation($"Picking toy from package: {package.Name} (ID: {package.Id})");


            var pickedToyType = PickToyTypeFromPackage(package);
            // If no toys are available in the picked toy type, Then we select another toy type until we find one with toys
            while (pickedToyType.ToyType.Toys.Count == 0)
            {
                _logger.LogWarning($"Picked toy type {pickedToyType.ToyType} has no toys, picking another toy type");
                pickedToyType = PickToyTypeFromPackage(package);
            }

            _logger.LogInformation($"Picked toy type: {pickedToyType.ToyType} with ratio {pickedToyType.Ratio}");

            
            var pickedToy = PickToyFromToyType(pickedToyType.ToyType);
            return new GiveawayPickedToyDto
            {
                Toy = pickedToy,
                Probability = (float)pickedToy.LuckPercentage / 100f
            };
        }
    }
}