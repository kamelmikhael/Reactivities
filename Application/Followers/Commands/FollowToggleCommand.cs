using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers.Commands
{
    public class FollowToggleCommand
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;    
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);
                
                if(target == null) return null;

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                if(following is null)
                {
                    _context.UserFollowings.Add(new UserFollowing {Observer = observer, Target = target});
                }
                else
                {
                    _context.UserFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                return success 
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Faild to update following");
            }
        }
    }
}