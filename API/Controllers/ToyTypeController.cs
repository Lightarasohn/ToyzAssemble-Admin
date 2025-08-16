using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyTypeDTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/toy-type")]
    public class ToyTypeController : ControllerBase
    {
        private readonly IToyTypeRepository _toyTypeRepository;
        public ToyTypeController(IToyTypeRepository toyTypeRepository)
        {
            _toyTypeRepository = toyTypeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var toyTypes = await _toyTypeRepository.GetAllToyTypesAsync();
                return Ok(toyTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var toyType = await _toyTypeRepository.GetToyTypeByIdAsync(id);
                if (toyType == null)
                {
                    return NotFound($"Toy type with ID {id} not found.");
                }
                return Ok(toyType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ToyTypeDto toyTypeDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var createdToyType = await _toyTypeRepository.AddToyTypeAsync(toyTypeDto);
                return CreatedAtAction(nameof(GetById), new { id = createdToyType.Id }, createdToyType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ToyTypeDto toyTypeDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var updatedToyType = await _toyTypeRepository.UpdateToyTypeAsync(toyTypeDto, id);
                if (updatedToyType == null)
                {
                    return NotFound($"Toy type with ID {id} not found.");
                }
                return Ok(updatedToyType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var deletedToyType = await _toyTypeRepository.DeleteToyTypeAsync(id);
                if (deletedToyType == null)
                {
                    return NotFound($"Toy type with ID {id} not found.");
                }
                return Ok(deletedToyType);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}