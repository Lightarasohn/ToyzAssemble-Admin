using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyDTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/toy-service")]
    public class ToyServiceController : ControllerBase
    {
        private readonly IToyService _toyUpdateRangeService;
        public ToyServiceController(IToyService toyUpdateRangeService)
        {
            _toyUpdateRangeService = toyUpdateRangeService;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRange([FromBody] ToyUpdateListServiceDto toyUpdateListServiceDtos)
        {
            try
            {
                var toyList = await _toyUpdateRangeService.UpdateRangeToyList(toyUpdateListServiceDtos);
                return Ok(toyList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}