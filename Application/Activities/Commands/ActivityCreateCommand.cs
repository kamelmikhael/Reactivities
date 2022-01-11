using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Dtos;
using Application.FluentValidations;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
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

        public ActivityCreateCommandHandler(DataContext context, IMapper mapper)
        {
            _context = context; 
            _mapper = mapper;   
        }

        public async Task<Result<Unit>> Handle(ActivityCreateCommand request, CancellationToken cancellationToken)
        {
            var activity = _mapper.Map<Activity>(request.Activity);
            _context.Activities.Add(activity);
            var result = await _context.SaveChangesAsync() > 0;

            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to create Activity.");
        }
    }
}