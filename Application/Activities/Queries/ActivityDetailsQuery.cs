using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Dtos;
using Application.Interfaces;
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
        private readonly IUserAccessor _userAccessor;

        public ActivityDetailsQueryHandler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<ActivityDto>> Handle(ActivityDetailsQuery request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new {currentUsername=_userAccessor.GetUsername()})
                .FirstOrDefaultAsync(x => x.Id == request.Id);
                
            return Result<ActivityDto>.Success(activity);
        }
    }
}