using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos.Commands
{
    public class PhotoDelete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;
            }
            
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x => x.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if(user == null) return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if(photo == null) return null;

                if(photo.IsMain) return Result<Unit>.Failure("You can not delete your main photo.");

                var cloudDeleteResult = await _photoAccessor.DeletePhoto(request.Id);

                if(cloudDeleteResult == null) return Result<Unit>.Failure("Problem deleting photo from Cloudinary.");

                user.Photos.Remove(photo);

                var databaseDeleteSuccess = await _context.SaveChangesAsync() > 0;

                return databaseDeleteSuccess ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem deleting photo from Database.");
            }
        }
    }
}