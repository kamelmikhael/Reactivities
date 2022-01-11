using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Exceptions;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class ActivityDeleteCommand : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
    }

    public class ActivityDeleteCommandHandler : IRequestHandler<ActivityDeleteCommand, Result<Unit>>
    {
        private readonly DataContext _context;

        public ActivityDeleteCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(ActivityDeleteCommand request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.FindAsync(request.Id);

            if(activity is null) return null;

            _context.Activities.Remove(activity);
            
            var result = await _context.SaveChangesAsync() > 0;

            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete Activity.");
        }
    }
}