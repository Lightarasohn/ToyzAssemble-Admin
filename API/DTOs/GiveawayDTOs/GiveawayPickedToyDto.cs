using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ToyDTOs;
using API.Models;

namespace API.DTOs.GiveawayDTOs
{
    public class GiveawayPickedToyDto
    {
        public ToyRandomDto Toy { get; set; } = null!;
        public float Probability { get; set; } = 0f;
    }
}