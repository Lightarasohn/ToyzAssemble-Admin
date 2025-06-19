using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IPackageToyTypeRepository
    {
        public int PackageId { get; set; }

        public int ToyTypeId { get; set; }

        public decimal Ratio { get; set; }
    }
}