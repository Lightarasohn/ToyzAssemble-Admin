using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Exceptions
{
    public class RandomToyNoToysInToyTypeException : Exception
    {
        public RandomToyNoToysInToyTypeException() : base("No toys available in the selected toy type.")
        {
        }
    }
}