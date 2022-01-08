using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Dtos;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class ActivityCreateCommand : IRequest
    {
        public ActivityUpdateCreateDto Activity { get; set; }
    }

    public class ActivityCreateCommandHandler : IRequestHandler<ActivityCreateCommand>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ActivityCreateCommandHandler(DataContext context, IMapper mapper)
        {
            _context = context; 
            _mapper = mapper;   
        }

        public async Task<Unit> Handle(ActivityCreateCommand request, CancellationToken cancellationToken)
        {
            var activity = _mapper.Map<Activity>(request.Activity);
            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();

            return Unit.Value;
        }
    }
}