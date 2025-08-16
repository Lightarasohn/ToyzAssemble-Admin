using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.GiveawayDTOs;
using API.Interfaces;
using API.Mappers;
using API.Models;

namespace API.Services
{
    public class GiveawayRepository : IGiveawayRepository
    {
        private readonly IPackageRepository _packageRepository;
        private readonly ILogger<GiveawayRepository> _logger;
        private readonly Random _random;

        public GiveawayRepository(IPackageRepository packageRepository, ILogger<GiveawayRepository> logger)
        {
            _packageRepository = packageRepository;
            _logger = logger;
            _random = new Random();
        }

        /// <summary>
        /// Generic weighted random selection helper method
        /// </summary>
        private T WeightedRandomSelect<T>(IEnumerable<T> items, Func<T, float> weightSelector)
        {
            var itemArray = items.ToArray();
            if (!itemArray.Any())
                throw new ArgumentException("Items collection cannot be empty");

            var totalWeight = itemArray.Sum(weightSelector);
            if (totalWeight <= 0)
                throw new ArgumentException("Total weight must be positive");

            var randomValue = (float)(_random.NextDouble() * totalWeight);
            float cumulative = 0f;

            foreach (var item in itemArray)
            {
                cumulative += weightSelector(item);
                if (randomValue <= cumulative)
                    return item;
            }

            // Fallback - floating point precision issues
            return itemArray.Last();
        }

        public PackageRarityType PickRarityTypeFromPackage(Package package)
        {
            var packageRarityTypes = package.PackageRarityTypes?.Where(pr => pr.Ratio > 0).ToList()
                ?? throw new Exception("Package has no rarity types");

            if (!packageRarityTypes.Any())
                throw new Exception("Package has no rarity types with positive ratios");

            var selectedRarityType = WeightedRandomSelect(
                packageRarityTypes, 
                pr => (float)pr.Ratio
            );

            _logger.LogInformation($"Picked rarity type: {selectedRarityType.RarityType.Name} with ratio {selectedRarityType.Ratio}");
            return selectedRarityType;
        }

        public Toy PickToyFromRarityType(RarityType rarityType)
        {
            var toys = rarityType.Toys?.Where(t => !t.Deleted && t.LuckPercentage > 0).ToList()
                ?? throw new Exception("Rarity type has no toys");

            if (!toys.Any())
                throw new Exception("Rarity type has no valid toys");

            var selectedToy = WeightedRandomSelect(
                toys, 
                t => (float)t.LuckPercentage
            );

            _logger.LogInformation($"Picked toy: {selectedToy.Name} with luck percentage {selectedToy.LuckPercentage}%");
            return selectedToy;
        }

        public async Task<GiveawayPickedToyDto> PickToyFromPackageAsync(int packageId)
        {
            var package = await _packageRepository.GetPackageByIdAsync(packageId) 
                ?? throw new Exception("Package not found");

            if (package.PackageRarityTypes?.Count == 0)
                throw new Exception("Package has no rarity types");

            _logger.LogInformation($"Picking toy from package: {package.Name} (ID: {package.Id})");

            const int maxAttempts = 10;
            int attempts = 0;
            PackageRarityType pickedRarityType;

            do
            {
                pickedRarityType = PickRarityTypeFromPackage(package);
                attempts++;

                if (pickedRarityType.RarityType.Toys?.Any(t => !t.Deleted && t.LuckPercentage > 0) == true)
                    break;

                if (attempts < maxAttempts)
                {
                    _logger.LogWarning($"Picked rarity type {pickedRarityType.RarityType.Name} has no valid toys, picking another rarity type (attempt {attempts})");
                }
            }
            while (attempts < maxAttempts);

            if (attempts >= maxAttempts)
            {
                throw new Exception("Could not find a rarity type with valid toys after maximum attempts");
            }

            _logger.LogInformation($"Selected rarity type: {pickedRarityType.RarityType.Name} with ratio {pickedRarityType.Ratio}");

            var pickedToy = PickToyFromRarityType(pickedRarityType.RarityType);
            var pickedToyDto = pickedToy.ToRandomDto();

            // Probability calculation
            var totalRarityRatio = package.PackageRarityTypes!.Sum(pr => (float)pr.Ratio);
            var totalToyLuckInRarity = pickedRarityType.RarityType.Toys!
                .Where(t => !t.Deleted && t.LuckPercentage > 0)
                .Sum(t => (float)t.LuckPercentage);

            float rarityTypeProbability = (float)pickedRarityType.Ratio / totalRarityRatio;
            float toyProbabilityInRarity = (float)pickedToy.LuckPercentage / totalToyLuckInRarity;
            float totalProbability = rarityTypeProbability * toyProbabilityInRarity;

            _logger.LogInformation($"Rarity type probability: {rarityTypeProbability:P4}");
            _logger.LogInformation($"Toy probability in rarity: {toyProbabilityInRarity:P4}");
            _logger.LogInformation($"Total probability: {totalProbability:P6}");

            return new GiveawayPickedToyDto
            {
                Toy = pickedToyDto,
                Probability = totalProbability * 100f // Convert to percentage for display
            };
        }
    }
}