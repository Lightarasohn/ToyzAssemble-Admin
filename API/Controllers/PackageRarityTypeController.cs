using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.PackageRarityTypeDTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/package-rarity-type")]
    public class PackageRarityTypeController : ControllerBase
    {
        private readonly IPackageRarityTypeRepository _repository;

        public PackageRarityTypeController(IPackageRarityTypeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var packageRarityTypes = await _repository.GetAllPackageRarityTypesAsync();
                return Ok(packageRarityTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("package/{id}")]
        public async Task<IActionResult> GetByPackageId(int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var packageRarityTypes = await _repository.GetAllPackageRarityTypeByPackageIdAsync(id);
                return Ok(packageRarityTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("rarityType/{id}")]
        public async Task<IActionResult> GetByRarityTypeId(int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var packageRarityTypes = await _repository.GetAllPackageRarityTypeByRarityTypeIdAsync(id);
                return Ok(packageRarityTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{packageId}/{rarityTypeId}")]
        public async Task<IActionResult> GetById(int packageId, int rarityTypeId)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var packageRarityType = await _repository.GetPackageRarityTypeByIdAsync(packageId, rarityTypeId);
                return Ok(packageRarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PackageRarityTypeDto packageRarityTypeDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var packageRarityType = await _repository.AddPackageRarityTypeAsync(packageRarityTypeDto);
                return CreatedAtAction(nameof(GetById),
                    new { packageId = packageRarityType.PackageId, rarityTypeId = packageRarityType.RarityTypeId },
                    packageRarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] PackageRarityTypeDto packageRarityTypeDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var updatedPackageRarityType = await _repository.UpdatePackageRarityTypeAsync(packageRarityTypeDto);
                return Ok(updatedPackageRarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] PackageRarityTypeDeleteDto deleteDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var deletedPackageRarityType = await _repository.DeletePackageRarityTypeAsync(deleteDto);
                return Ok(deletedPackageRarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("package/{packageId}")]
        public async Task<IActionResult> DeleteAllByPackageId([FromRoute] int packageId)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var deletedPackageRarityType = await _repository.DeletePackageRarityTypesByPackageIdAsync(packageId);
                return Ok(deletedPackageRarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}