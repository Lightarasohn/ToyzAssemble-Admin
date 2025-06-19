using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
            try
            {
                var toys = await _toyRepository.GetAllToysAsync();
                return Ok(toys);
            }
            catch
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var toy = await _toyRepository.GetToyByIdAsync(id);
                if (toy == null)
                {
                    return NotFound($"Toy with ID {id} not found.");
                }
                return Ok(toy);
            }
            catch
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DTOs.ToyDTOs.ToyDto toyDto)
        {
            if (toyDto == null)
            {
                return BadRequest("Toy data is required.");
            }

            try
            {
                var createdToy = await _toyRepository.AddToyAsync(toyDto);
                return CreatedAtAction(nameof(GetById), new { id = createdToy.Id }, createdToy);
            }
            catch
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DTOs.ToyDTOs.ToyDto toyDto)
        {
            if (toyDto == null)
            {
                return BadRequest("Toy data is required.");
            }

            try
            {
                var updatedToy = await _toyRepository.UpdateToyAsync(toyDto, id);
                if (updatedToy == null)
                {
                    return NotFound($"Toy with ID {id} not found.");
                }
                return Ok(updatedToy);
            }
            catch
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deletedToy = await _toyRepository.DeleteToyAsync(id);
                if (deletedToy == null)
                {
                    return NotFound($"Toy with ID {id} not found.");
                }
                return Ok(deletedToy);
            }
            catch
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}