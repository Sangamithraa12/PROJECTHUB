using ProjectHubAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectHubAPI.Services
{
    public interface IProjectService
    {
        IEnumerable<ProjectDto> GetAllProjects();
        ProjectDto GetProjectById(int id);
        ProjectDto CreateProject(CreateProjectDto projectDto);
        ProjectDto UpdateProject(int id, CreateProjectDto projectDto);
        bool DeleteProject(int id);
    }
}

