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

        public PackageRarityType PickRarityTypeFromPackage(Package package)
        {
            var packageRarityTypes = package.PackageRarityTypes ?? throw new Exception("Package has no rarity types");
            if (!packageRarityTypes.Any()) throw new Exception("Package has no rarity types");

            float totalProbability = packageRarityTypes.Sum(pr => (float)pr.Ratio);
            if (totalProbability <= 0) throw new Exception("Total probability of rarity types in package is zero or negative");

            float ratioConvertRate = 100f / totalProbability;
            var random = new Random();
            float roll = (float)(random.NextDouble() * 100);
            float cumulative = 0f;

            foreach (var pr in packageRarityTypes)
            {
                cumulative += (float)pr.Ratio * ratioConvertRate;
                if (roll < cumulative)
                {
                    _logger.LogInformation($"Picked rarity type: {pr.RarityType.Name} with ratio {pr.Ratio}");
                    return pr;
                }
            }

            var fallback = packageRarityTypes.Last();
            _logger.LogInformation($"Picked rarity type (fallback): {fallback.RarityType.Name} with ratio {fallback.Ratio}");
            return fallback;
        }

        public Toy PickToyFromRarityType(RarityType rarityType)
        {
            var toys = rarityType.Toys ?? throw new Exception("Rarity type has no toys");
            if (!toys.Any()) throw new Exception("Rarity type has no toys");

            float totalProbability = toys.Sum(t => (float)t.LuckPercentage);
            if (totalProbability <= 0) throw new Exception("Total probability of toys in rarity type is zero or negative");

            float ratioConvertRate = 100f / totalProbability;
            var random = new Random();
            float roll = (float)(random.NextDouble() * 100);
            float cumulative = 0f;

            foreach (var toy in toys)
            {
                cumulative += (float)toy.LuckPercentage * ratioConvertRate;
                if (roll < cumulative)
                {
                    _logger.LogInformation($"Picked toy: {toy.Name} with luck percentage {toy.LuckPercentage}%");
                    return toy;
                }
            }

            var fallback = toys.Last();
            _logger.LogInformation($"Picked toy (fallback): {fallback.Name} with luck percentage {fallback.LuckPercentage}%");
            return fallback;
        }

        public async Task<GiveawayPickedToyDto> PickToyFromPackageAsync(int packageId)
        {
            var package = await _packageRepository.GetPackageByIdAsync(packageId) ?? throw new Exception("Package not found");
            if (package.PackageRarityTypes?.Count == 0) throw new Exception("Package has no rarity types");

            _logger.LogInformation($"Picking toy from package: {package.Name} (ID: {package.Id})");

            var pickedRarityType = PickRarityTypeFromPackage(package);

            int maxAttempts = 10;
            int attempts = 0;

            while (pickedRarityType.RarityType.Toys?.Count == 0 && attempts < maxAttempts)
            {
                _logger.LogWarning($"Picked rarity type {pickedRarityType.RarityType.Name} has no toys, picking another rarity type (attempt {attempts + 1})");
                pickedRarityType = PickRarityTypeFromPackage(package);
                attempts++;
            }

            if (attempts >= maxAttempts)
            {
                throw new Exception("Could not find a rarity type with toys after maximum attempts");
            }

            _logger.LogInformation($"Selected rarity type: {pickedRarityType.RarityType.Name} with ratio {pickedRarityType.Ratio}");

            var pickedToy = PickToyFromRarityType(pickedRarityType.RarityType);


            float rarityTypeProbability = (float)pickedRarityType.Ratio / package.PackageRarityTypes!.Sum(pr => (float)pr.Ratio);
            float toyProbabilityInRarity = (float)pickedToy.LuckPercentage / pickedRarityType.RarityType.Toys!.Sum(t => (float)t.LuckPercentage);
            float totalProbability = rarityTypeProbability * toyProbabilityInRarity;

            return new GiveawayPickedToyDto
            {
                Toy = pickedToy,
                Probability = totalProbability
            };
        }
    }
}