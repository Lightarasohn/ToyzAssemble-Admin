using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.DeletedDTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/deleted")]
    public class DeletedServiceController : ControllerBase
    {
        private readonly IDeletedService _deletedService;
        public DeletedServiceController(IDeletedService deletedService)
        {
            _deletedService = deletedService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var allDeleted = await _deletedService.GetAllDeletedAsync();
                return Ok(allDeleted);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> UnDelete([FromBody] UnDeleteDTO unDeleteDTO)
        {
            try
            {
                var unDeleted = await _deletedService.UnDeleteAsync(unDeleteDTO);
                return Ok(unDeleted);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}