using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.RarityTypeDTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/rarity-type")]
    public class RarityTypeController : ControllerBase
    {
        private readonly IRarityTypeRepository _rarityTypeRepo;
        public RarityTypeController(IRarityTypeRepository rarityTypeRepo)
        {
            _rarityTypeRepo = rarityTypeRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var rarityTypes = await _rarityTypeRepo.GetAllRarityTypesAsync();
                return Ok(rarityTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var rarityType = await _rarityTypeRepo.GetRarityTypeByIdAsync(id);
                return Ok(rarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var rarityType = await _rarityTypeRepo.DeleteRarityTypeAsync(id);
                return Ok(rarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] RarityTypeDto rarityTypeDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var rarityType = await _rarityTypeRepo.AddRarityTypeAsync(rarityTypeDto);
                return Ok(rarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] RarityTypeDto rarityTypeDto, [FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var rarityType = await _rarityTypeRepo.UpdateRarityTypeAsync(rarityTypeDto, id); 
                return Ok(rarityType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}