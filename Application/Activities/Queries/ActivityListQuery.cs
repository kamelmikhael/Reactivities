using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Dtos;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries
{
    public class ActivityListQuery : IRequest<List<ActivityDto>>
    {}

    public class ActivityListQueryHandler : IRequestHandler<ActivityListQuery, List<ActivityDto>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        
        public ActivityListQueryHandler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ActivityDto>> Handle(ActivityListQuery request, CancellationToken cancellationToken)
        {
            var activities = await _context.Activities.ToListAsync(cancellationToken);
            var activitiesDto = _mapper.Map<List<ActivityDto>>(activities);
            return activitiesDto;
        }
    }
}