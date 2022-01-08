using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class ActivityDeleteCommand : IRequest
    {
        public Guid Id { get; set; }
    }

    public class ActivityDeleteCommandHandler : IRequestHandler<ActivityDeleteCommand>
    {
        private readonly DataContext _context;

        public ActivityDeleteCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(ActivityDeleteCommand request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.FindAsync(request.Id);
            if(activity is null) 
            {
                throw new NotFounException($"Activity with Id = {request.Id} can not be found!");
            }
            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();

            return Unit.Value;
        }
    }
}