using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.ToyDTOs
{
    public class ToyUpdateListServiceDto
    {
        public List<int> IdList { get; set; } = new()!;
        public ToyUpdateServiceDto UpdateDto { get; set; } = new()!; 
    }
}