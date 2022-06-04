using System.Threading.Tasks;
using Application.Followers.Commands;
using Application.Followers.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> FollowToggle(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggleCommand.Command { TargetUsername = username }));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollowings(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new FollowersListQuery.Query { Username = username, Predicate = predicate }));
        }
    }
}