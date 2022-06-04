using System;
using System.Collections.Generic;
using System.Linq;
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

namespace Application.Followers.Queries
{
    public class FollowersListQuery
    {
        public class Query : IRequest<Result<List<ProfileDto>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ProfileDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;    
            }

            public async Task<Result<List<ProfileDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<ProfileDto>();

                switch(request.Predicate)
                {
                    case "followers": // بيرجع الاشخاص اللي هما بيتبعوه
                        profiles = await _context.UserFollowings.Where(x => x.Target.UserName == request.Username)
                            .Select(u => u.Observer)
                            .ProjectTo<ProfileDto>(_mapper.ConfigurationProvider,
                                new { currentUsername = _userAccessor.GetUsername() })
                            .ToListAsync();
                        break;
                    case "followings": // بيرجع الاشخاص اللي هو بيتابعهم
                        profiles = await _context.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                            .Select(u => u.Target)
                            .ProjectTo<ProfileDto>(_mapper.ConfigurationProvider,
                                new { currentUsername = _userAccessor.GetUsername() })
                            .ToListAsync();
                        break;
                }

                return Result<List<ProfileDto>>.Success(profiles);
            }
        }
    }
}