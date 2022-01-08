using System.Threading;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Exceptions;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class ActivityUpdateCommand : IRequest
    {
        public ActivityUpdateCreateDto Activity { get; set; }
    }

    public class ActivityUpdateCommandHandler : IRequestHandler<ActivityUpdateCommand>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ActivityUpdateCommandHandler(DataContext context,
           IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(ActivityUpdateCommand request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.FindAsync(request.Activity.Id);
            if(activity is null) 
            {
                throw new NotFounException($"Activity with Id = {request.Activity.Id} can not be found!");
            }
            
            _mapper.Map(request.Activity, activity);
            
            await _context.SaveChangesAsync();

            return Unit.Value;
        }
    }
}