using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Dtos;
using Application.Exceptions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries
{
    public class ActivityDetailsQuery : IRequest<Result<ActivityDto>> 
    {
        public Guid Id { get; set; }
    }

    public class ActivityDetailsQueryHandler : IRequestHandler<ActivityDetailsQuery, Result<ActivityDto>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ActivityDetailsQueryHandler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<ActivityDto>> Handle(ActivityDetailsQuery request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);
            //var activityDto = _mapper.Map<ActivityDto>(activity);
            return Result<ActivityDto>.Success(activity);
        }
    }
}