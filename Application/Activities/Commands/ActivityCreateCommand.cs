using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Dtos;
using Application.FluentValidations;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands
{
    public class ActivityCreateCommand : IRequest<Result<Unit>>
    {
        public ActivityUpdateCreateDto Activity { get; set; }
    }

    public class ActivityCreateCommandValidator : AbstractValidator<ActivityCreateCommand>
    {
        public ActivityCreateCommandValidator()
        {
            RuleFor(x => x.Activity).SetValidator(new ActivityUpdateCreateDtoValidator());
        }
    }

    public class ActivityCreateCommandHandler : IRequestHandler<ActivityCreateCommand, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public ActivityCreateCommandHandler(DataContext context, 
            IMapper mapper,
            IUserAccessor userAccessor)
        {
            _context = context; 
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(ActivityCreateCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

            var activity = _mapper.Map<Activity>(request.Activity);
            
            activity.Attendees.Add(new ActivityAttendee
            {
                AppUserId = user.Id,
                IsHost = true,
            });

            _context.Activities.Add(activity);
            
            var result = await _context.SaveChangesAsync() > 0;

            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to create Activity.");
        }
    }
}