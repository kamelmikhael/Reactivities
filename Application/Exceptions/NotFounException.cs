using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class NotFounException : Exception
    {
        public NotFounException(string message) : base(message)
        {}

        public NotFounException(string message, Exception innerException) : base(message, innerException)
        {}
    }
}