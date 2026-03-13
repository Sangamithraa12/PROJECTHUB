using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectHubAPI.DTOs;
using ProjectHubAPI.Services;
using System.Linq;

namespace ProjectHubAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public IActionResult GetTasks()
        {
            return Ok(_taskService.GetAllTasks());
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult CreateTask(CreateTaskDto taskDto)
        {
            var result = _taskService.CreateTask(taskDto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult UpdateTask(int id, CreateTaskDto taskDto)
        {
            var result = _taskService.UpdateTask(id, taskDto);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult DeleteTask(int id)
        {
            var success = _taskService.DeleteTask(id);
            if (!success) return NotFound();

            return Ok();
        }

        [HttpPost("{id}/assign")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult AssignTask(int id, [FromBody] int userId)
        {
            var success = _taskService.AssignTask(id, userId);
            if (!success) return NotFound("Task or User not found");

            return Ok("Task Assigned Successfully");
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Manager,Employee")]
        public IActionResult UpdateStatus(int id, [FromBody] string status)
        {
            var success = _taskService.UpdateStatus(id, status);
            if (!success) return NotFound();

            return Ok();
        }

        [HttpPost("{id}/comment")]
        [Authorize(Roles = "Admin,Manager,Employee")]
        public IActionResult AddComment(int id, [FromBody] string content)
        {
            var userIdStr = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var result = _taskService.AddComment(id, userId, content);
            if (result == null) return NotFound("Task not found");

            return Ok(result);
        }

        [HttpPut("comment/{id}")]
        [Authorize(Roles = "Admin,Manager,Employee")]
        public IActionResult UpdateComment(int id, [FromBody] string content)
        {
            var result = _taskService.UpdateComment(id, content);
            if (result == null) return NotFound("Comment not found");

            return Ok(result);
        }

        [HttpDelete("comment/{id}")]
        [Authorize(Roles = "Admin,Manager,Employee")]
        public IActionResult DeleteComment(int id)
        {
            var success = _taskService.DeleteComment(id);
            if (!success) return NotFound("Comment not found");

            return Ok();
        }
    }
}
