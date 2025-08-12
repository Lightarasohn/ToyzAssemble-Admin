using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/random-toy")]
    public class RandomToyController : ControllerBase
    {
        private readonly IGiveawayRepository _giveawayRepository;

        public RandomToyController(IGiveawayRepository giveawayRepository)
        {
            _giveawayRepository = giveawayRepository;
        }

        [HttpGet("{packageId}")]
        public async Task<IActionResult> GetRandomToy(int packageId)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var result = await _giveawayRepository.PickToyFromPackageAsync(packageId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}