using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyDTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/toy")]
    public class ToyController : ControllerBase
    {
        private readonly IToyRepository _toyRepository;

        public ToyController(IToyRepository toyRepository)
        {
            _toyRepository = toyRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var toys = await _toyRepository.GetAllToysAsync();
                return Ok(toys);
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
                var toy = await _toyRepository.GetToyByIdAsync(id);
                if (toy == null)
                {
                    return NotFound($"Toy with ID {id} not found.");
                }
                return Ok(toy);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ToyDto toyDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var createdToy = await _toyRepository.AddToyAsync(toyDto);
                return CreatedAtAction(nameof(GetById), new { id = createdToy.Id }, createdToy);
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
                var deletedToy = await _toyRepository.DeleteToyAsync(id);
                if (deletedToy == null)
                {
                    return NotFound($"Toy with ID {id} not found.");
                }
                return Ok(deletedToy);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ToyDto toyDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var updatedToy = await _toyRepository.UpdateToyAsync(toyDto, id);
                if (updatedToy == null)
                {
                    return NotFound($"Toy with ID {id} not found.");
                }
                return Ok(updatedToy);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}