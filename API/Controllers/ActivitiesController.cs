using System;
using System.Threading.Tasks;
using Application.Activities.Commands;
using Application.Activities.Queries;
using Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities() => 
            HandleResult(await Mediator.Send(new ActivityListQuery()));
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id) => 
            HandleResult(await Mediator.Send(new ActivityDetailsQuery(){Id = id}));

        [HttpPost]
        public async Task<IActionResult> CreateActivity(ActivityUpdateCreateDto activity) => 
            HandleResult(await Mediator.Send(new ActivityCreateCommand { Activity = activity }));

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id, ActivityUpdateCreateDto activity)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(new ActivityUpdateCommand { Activity = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id) =>
            HandleResult(await Mediator.Send(new ActivityDeleteCommand { Id = id }));
    }
}