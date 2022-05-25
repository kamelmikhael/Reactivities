using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Photos.Commands;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] PhotoAdd.Command command) =>
            HandleResult(await Mediator.Send(command));  

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id) =>
            HandleResult(await Mediator.Send(new PhotoDelete.Command { Id = id }));  

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(string id) =>
            HandleResult(await Mediator.Send(new PhotoSetMain.Command { Id = id }));  
    }
}