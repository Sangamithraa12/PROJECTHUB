using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectHubAPI.DTOs;
using ProjectHubAPI.Services;

namespace ProjectHubAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public IActionResult GetProjects()
        {
            return Ok(_projectService.GetAllProjects());
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult CreateProject(CreateProjectDto projectDto)
        {
            var result = _projectService.CreateProject(projectDto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult UpdateProject(int id, CreateProjectDto projectDto)
        {
            var result = _projectService.UpdateProject(id, projectDto);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult DeleteProject(int id)
        {
            var success = _projectService.DeleteProject(id);
            if (!success) return NotFound();

            return Ok();
        }
    }
}

