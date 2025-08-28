using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contexts;
using API.DTOs.GiveawayDTOs;
using API.Interfaces;
using API.Mappers;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class GiveawayRepository : IGiveawayRepository
    {
        private readonly ILogger<GiveawayRepository> _logger;
        private readonly Random _random;
        private readonly PostgresContext _context;

        public GiveawayRepository(ILogger<GiveawayRepository> logger, PostgresContext context)
        {
            _context = context;
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
            float cumulativeWeight = 0f;

            foreach (var item in itemArray)
            {
                cumulativeWeight += weightSelector(item);
                if (randomValue <= cumulativeWeight)
                    return item;
            }

            // Fallback for floating point precision issues
            return itemArray.Last();
        }

        private async Task<List<PackageRarityType>> GetValidPackageRarityTypesAsync(int packageId)
        {
            // First get non-deleted PackageRarityTypes
            var packageRarityTypes = await _context.PackageRarityTypes
                .AsNoTracking()
                .Where(pr => pr.PackageId == packageId && 
                             pr.Ratio > 0 && 
                             !pr.Deleted)
                .ToListAsync();

            if (!packageRarityTypes.Any())
                throw new Exception($"Package {packageId} has no valid PackageRarityTypes with positive ratios");

            // Check if Package exists and is not deleted
            var packageExists = await _context.Packages
                .AsNoTracking()
                .AnyAsync(p => p.Id == packageId && !p.Deleted);

            if (!packageExists)
                throw new Exception($"Package {packageId} not found or is deleted");

            // Get non-deleted RarityTypeIds from the PackageRarityTypes
            var rarityTypeIds = packageRarityTypes.Select(pr => pr.RarityTypeId).ToList();
            var validRarityTypeIds = await _context.RarityTypes
                .AsNoTracking()
                .Where(rt => rarityTypeIds.Contains(rt.Id) && !rt.Deleted)
                .Select(rt => rt.Id)
                .ToListAsync();

            // Filter PackageRarityTypes to only include those with valid RarityTypes
            var filteredPackageRarityTypes = packageRarityTypes
                .Where(pr => validRarityTypeIds.Contains(pr.RarityTypeId))
                .ToList();

            if (!filteredPackageRarityTypes.Any())
                throw new Exception($"Package {packageId} has no valid RarityTypes");

            // Filter rarity types that have valid toys
            var toyValidRarityTypeIds = await _context.Toys
                .AsNoTracking()
                .Where(t => !t.Deleted && 
                           t.LuckPercentage > 0 && 
                           validRarityTypeIds.Contains(t.RarityId))
                .Select(t => t.RarityId)
                .Distinct()
                .ToListAsync();

            // Check if ToyTypes for these toys are not deleted
            var toysWithValidToyTypes = await (from t in _context.Toys
                                             join tt in _context.ToyTypes on t.ToyTypeId equals tt.Id
                                             where !t.Deleted && 
                                                   !tt.Deleted &&
                                                   t.LuckPercentage > 0 && 
                                                   toyValidRarityTypeIds.Contains(t.RarityId)
                                             select t.RarityId).Distinct().ToListAsync();

            var finalValidPackageRarityTypes = filteredPackageRarityTypes
                .Where(pr => toysWithValidToyTypes.Contains(pr.RarityTypeId))
                .ToList();

            if (!finalValidPackageRarityTypes.Any())
                throw new Exception($"Package {packageId} has no rarity types with valid toys");

            return finalValidPackageRarityTypes;
        }

        private async Task<RarityType> GetRarityTypeAsync(int rarityTypeId)
        {
            var rarityType = await _context.RarityTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(rt => rt.Id == rarityTypeId && !rt.Deleted);

            if (rarityType == null)
                throw new Exception($"Rarity type with ID {rarityTypeId} not found or is deleted");

            return rarityType;
        }

        private async Task<List<Toy>> GetValidToysForRarityAsync(int rarityTypeId)
        {
            // Get toys that are not deleted and have valid luck percentage
            var toys = await _context.Toys
                .AsNoTracking()
                .Where(t => !t.Deleted && 
                           t.LuckPercentage > 0 && 
                           t.RarityId == rarityTypeId)
                .ToListAsync();

            if (!toys.Any())
                throw new Exception($"No toys found for rarity type {rarityTypeId}");

            // Check if RarityType is not deleted
            var rarityTypeExists = await _context.RarityTypes
                .AsNoTracking()
                .AnyAsync(rt => rt.Id == rarityTypeId && !rt.Deleted);

            if (!rarityTypeExists)
                throw new Exception($"Rarity type {rarityTypeId} not found or is deleted");

            // Filter toys that have valid (non-deleted) ToyTypes
            var toyIds = toys.Select(t => t.Id).ToList();
            var toysWithValidToyTypes = await (from t in _context.Toys
                                             join tt in _context.ToyTypes on t.ToyTypeId equals tt.Id
                                             where toyIds.Contains(t.Id) && !tt.Deleted
                                             select t.Id).ToListAsync();

            var validToys = toys.Where(t => toysWithValidToyTypes.Contains(t.Id)).ToList();

            if (!validToys.Any())
                throw new Exception($"Rarity type {rarityTypeId} has no toys with valid toy types");

            return validToys;
        }

        private async Task<(RarityType rarity, ToyType toyType)> GetToyDetailsAsync(int rarityId, int toyTypeId)
        {
            var rarity = await _context.RarityTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == rarityId && !r.Deleted);

            var toyType = await _context.ToyTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(tt => tt.Id == toyTypeId && !tt.Deleted);

            if (rarity == null)
                throw new Exception($"Rarity with ID {rarityId} not found or is deleted");

            if (toyType == null)
                throw new Exception($"ToyType with ID {toyTypeId} not found or is deleted");

            return (rarity, toyType);
        }

        private async Task<Package> GetValidPackageAsync(int packageId)
        {
            var package = await _context.Packages
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == packageId && !p.Deleted);

            if (package == null)
                throw new Exception($"Package with ID {packageId} not found or is deleted");

            return package;
        }

        public PackageRarityType PickRarityTypeFromPackage(Package package)
        {
            throw new NotImplementedException("Use PickRarityTypeFromPackageAsync instead for better performance");
        }

        private async Task<PackageRarityType> PickRarityTypeFromPackageAsync(List<PackageRarityType> validRarityTypes)
        {
            if (!validRarityTypes.Any())
                throw new ArgumentException("No valid rarity types provided");

            var selectedRarityType = WeightedRandomSelect(
                validRarityTypes, 
                pr => (float)pr.Ratio
            );

            var rarityType = await GetRarityTypeAsync(selectedRarityType.RarityTypeId);
            
            _logger.LogInformation($"Picked rarity type: {rarityType.Name} with ratio {selectedRarityType.Ratio}");
            
            return selectedRarityType;
        }

        public async Task<Toy> PickToyFromRarityType(RarityType rarityType)
        {
            if (rarityType == null)
                throw new ArgumentNullException(nameof(rarityType));

            // Rarity type'ın deleted olup olmadığını kontrol et
            if (rarityType.Deleted)
                throw new ArgumentException($"RarityType {rarityType.Id} is deleted");

            var toys = await GetValidToysForRarityAsync(rarityType.Id);
            
            var selectedToy = WeightedRandomSelect(toys, t => (float)t.LuckPercentage);

            _logger.LogInformation($"Picked toy: {selectedToy.Name} with luck percentage {selectedToy.LuckPercentage}%");
            
            return selectedToy;
        }

        public async Task<GiveawayPickedToyDto> PickToyFromPackageAsync(int packageId)
        {
            // Validate package exists and is not deleted
            var package = await GetValidPackageAsync(packageId);

            _logger.LogInformation($"Picking toy from package ID: {packageId} - {package.Name}");

            // Get all valid rarity types for the package
            var validRarityTypes = await GetValidPackageRarityTypesAsync(packageId);

            // Try to pick a valid rarity type with retry logic
            const int maxAttempts = 30;
            PackageRarityType selectedRarityType = null!;
            int attempts = 0;

            while (attempts < maxAttempts && selectedRarityType == null)
            {
                attempts++;
                var candidateRarityType = await PickRarityTypeFromPackageAsync(validRarityTypes);
                
                // Check if this rarity type has valid toys (with all deleted checks)
                var hasValidToys = await (from t in _context.Toys
                                         join rt in _context.RarityTypes on t.RarityId equals rt.Id
                                         join tt in _context.ToyTypes on t.ToyTypeId equals tt.Id
                                         where !t.Deleted && 
                                               !rt.Deleted &&
                                               !tt.Deleted &&
                                               t.LuckPercentage > 0 && 
                                               t.RarityId == candidateRarityType.RarityTypeId
                                         select t.Id).AnyAsync();

                if (hasValidToys)
                {
                    selectedRarityType = candidateRarityType;
                }
                else if (attempts < maxAttempts)
                {
                    _logger.LogWarning($"Rarity type {candidateRarityType.RarityTypeId} has no valid toys, retrying (attempt {attempts})");
                }
            }

            if (selectedRarityType == null)
                throw new Exception($"Could not find a rarity type with valid toys after {maxAttempts} attempts");

            // Get toys for the selected rarity type and pick one
            var availableToys = await GetValidToysForRarityAsync(selectedRarityType.RarityTypeId);
            var selectedToy = WeightedRandomSelect(availableToys, t => (float)t.LuckPercentage);

            // Get toy details (Rarity and ToyType) - both will be checked for deletion
            var (rarity, toyType) = await GetToyDetailsAsync(selectedToy.RarityId, selectedToy.ToyTypeId);

            _logger.LogInformation($"Selected toy: {selectedToy.Name} from rarity: {rarity.Name}, type: {toyType.Name}");

            // Create DTO
            var pickedToyDto = selectedToy.ToRandomDto(toyType, rarity);

            // Calculate probability
            var probability = await CalculateToyProbabilityAsync(packageId, selectedRarityType, selectedToy);

            _logger.LogInformation($"Total probability: {probability:P6}");

            return new GiveawayPickedToyDto
            {
                Toy = pickedToyDto,
                Probability = probability * 100f // Convert to percentage
            };
        }

        private async Task<float> CalculateToyProbabilityAsync(int packageId, PackageRarityType selectedRarityType, Toy selectedToy)
        {
            // Get total ratio for all valid rarity types in package (not deleted)
            var packageRarityTypeIds = await _context.PackageRarityTypes
                .AsNoTracking()
                .Where(pr => pr.PackageId == packageId && 
                            !pr.Deleted && 
                            pr.Ratio > 0)
                .Select(pr => pr.RarityTypeId)
                .ToListAsync();

            // Filter by valid packages and rarity types
            var validPackageExists = await _context.Packages
                .AsNoTracking()
                .AnyAsync(p => p.Id == packageId && !p.Deleted);

            var validRarityTypeIds = await _context.RarityTypes
                .AsNoTracking()
                .Where(rt => packageRarityTypeIds.Contains(rt.Id) && !rt.Deleted)
                .Select(rt => rt.Id)
                .ToListAsync();

            var totalRarityRatio = await _context.PackageRarityTypes
                .AsNoTracking()
                .Where(pr => pr.PackageId == packageId && 
                            !pr.Deleted && 
                            validRarityTypeIds.Contains(pr.RarityTypeId) &&
                            pr.Ratio > 0)
                .SumAsync(pr => (float)pr.Ratio);

            // Get total luck percentage for all valid toys in the selected rarity
            var toysInRarity = await _context.Toys
                .AsNoTracking()
                .Where(t => !t.Deleted && 
                           t.LuckPercentage > 0 && 
                           t.RarityId == selectedRarityType.RarityTypeId)
                .Select(t => new { t.Id, t.LuckPercentage, t.ToyTypeId })
                .ToListAsync();

            // Check ToyTypes are not deleted
            var toyTypeIds = toysInRarity.Select(t => t.ToyTypeId).Distinct().ToList();
            var validToyTypeIds = await _context.ToyTypes
                .AsNoTracking()
                .Where(tt => toyTypeIds.Contains(tt.Id) && !tt.Deleted)
                .Select(tt => tt.Id)
                .ToListAsync();

            var totalToyLuckInRarity = toysInRarity
                .Where(t => validToyTypeIds.Contains(t.ToyTypeId))
                .Sum(t => (float)t.LuckPercentage);

            if (totalRarityRatio <= 0)
                throw new Exception("Total rarity ratio is zero or negative");

            if (totalToyLuckInRarity <= 0)
                throw new Exception("Total toy luck percentage is zero or negative");

            var rarityTypeProbability = (float)selectedRarityType.Ratio / totalRarityRatio;
            var toyProbabilityInRarity = (float)selectedToy.LuckPercentage / totalToyLuckInRarity;
            var totalProbability = rarityTypeProbability * toyProbabilityInRarity;

            _logger.LogInformation($"Rarity type probability: {rarityTypeProbability:P4}");
            _logger.LogInformation($"Toy probability in rarity: {toyProbabilityInRarity:P4}");

            return totalProbability;
        }
    }
}