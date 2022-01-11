using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Dtos;
using Application.Exceptions;
using Application.FluentValidations;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class ActivityUpdateCommand : IRequest<Result<Unit>>
    {
        public ActivityUpdateCreateDto Activity { get; set; }
    }

    public class ActivityUpdateCommandValidator : AbstractValidator<ActivityUpdateCommand>
    {
        public ActivityUpdateCommandValidator()
        {
            RuleFor(x => x.Activity).SetValidator(new ActivityUpdateCreateDtoValidator());
        }
    }

    public class ActivityUpdateCommandHandler : IRequestHandler<ActivityUpdateCommand, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ActivityUpdateCommandHandler(DataContext context,
           IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<Unit>> Handle(ActivityUpdateCommand request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.FindAsync(request.Activity.Id);
            
            if(activity is null) return null;
            
            _mapper.Map(request.Activity, activity);
            
            var result = await _context.SaveChangesAsync() > 0;

            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update Activity.");
        }
    }
}