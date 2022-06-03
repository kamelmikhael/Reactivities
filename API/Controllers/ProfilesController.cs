using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username) =>
            HandleResult(await Mediator.Send(new ProfileDetails.Query {Username = username}));  

        [HttpPut]
        public async Task<IActionResult> EditProfile(ProfileEdit.Command command) =>
            HandleResult(await Mediator.Send(command));  
    }
}