using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.PackageToyTypeDTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/packageToyType")]
    public class PackageToyTypeController : ControllerBase
    {
        private readonly IPackageToyTypeRepository _repository;

        public PackageToyTypeController(IPackageToyTypeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var packageToyTypes = await _repository.GetAllPackageToyTypesAsync();
                return Ok(packageToyTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        [HttpGet("package/{id}")]
        public async Task<IActionResult> GetByPackageId(int id)
        {
            try
            {
                var packageToyTypes = await _repository.GetAllPackageToyTypeByPackageIdAsync(id);
                return Ok(packageToyTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        [HttpGet("toyType/{id}")]
        public async Task<IActionResult> GetByToyTypeId(int id)
        {
            try
            {
                var packageToyTypes = await _repository.GetAllPackageToyTypeByToyTypeIdAsync(id);
                return Ok(packageToyTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        [HttpGet("{packageId}/{toyTypeId}")]
        public async Task<IActionResult> GetById(int packageId, int toyTypeId)
        {
            try
            {
                var packageToyType = await _repository.GetPackageToyTypeByIdAsync(packageId, toyTypeId);
                return Ok(packageToyType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PackageToyTypeDto packageToyTypeDto)
        {
            try
            {
                var packageToyType = await _repository.AddPackageToyTypeAsync(packageToyTypeDto);
                return CreatedAtAction(nameof(GetById), new { packageId = packageToyType.PackageId, toyTypeId = packageToyType.ToyTypeId }, packageToyType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        [HttpPut("{packageId}/{toyTypeId}")]
        public async Task<IActionResult> Update(int packageId, int toyTypeId, [FromBody] PackageToyTypeDto packageToyTypeDto)
        {
            if (packageToyTypeDto == null)
            {
                return BadRequest("PackageToyType data is required.");
            }

            try
            {
                var updatedPackageToyType = await _repository.UpdatePackageToyTypeAsync(packageToyTypeDto, packageId, toyTypeId);
                return Ok(updatedPackageToyType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        [HttpDelete("{packageId}/{toyTypeId}")]
        public async Task<IActionResult> Delete(int packageId, int toyTypeId)
        {
            try
            {
                var deletedPackageToyType = await _repository.DeletePackageToyTypeAsync(packageId, toyTypeId);
                return Ok(deletedPackageToyType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        } 
    }
}