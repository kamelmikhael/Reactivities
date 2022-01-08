using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Activities.Queries
{
    public class ActivityDetailsQuery : IRequest<ActivityDto> 
    {
        public Guid Id { get; set; }
    }

    public class ActivityDetailsQueryHandler : IRequestHandler<ActivityDetailsQuery, ActivityDto>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ActivityDetailsQueryHandler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ActivityDto> Handle(ActivityDetailsQuery request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.FindAsync(request.Id);  
            if(activity is null) 
            {
                throw new NotFounException($"Activity with Id = {request.Id} can not be found!");
            }
            var activityDto = _mapper.Map<ActivityDto>(activity);
            return activityDto;
        }
    }
}