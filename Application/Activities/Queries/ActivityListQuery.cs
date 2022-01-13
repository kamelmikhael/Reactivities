using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries
{
    public class ActivityListQuery : IRequest<Result<List<ActivityDto>>>
    {}

    public class ActivityListQueryHandler : IRequestHandler<ActivityListQuery, Result<List<ActivityDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        
        public ActivityListQueryHandler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<ActivityDto>>> Handle(ActivityListQuery request, CancellationToken cancellationToken)
        {
            var activities = await _context.Activities
                //.Include(x => x.Attendees).ThenInclude(x => x.AppUser)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
            return Result<List<ActivityDto>>.Success(activities);
        }
    }
}