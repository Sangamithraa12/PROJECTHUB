using ProjectHubAPI.Data;
using ProjectHubAPI.DTOs;
using ProjectHubAPI.Models;
using ProjectHubAPI.Services;
using System.Collections.Generic;
using System.Linq;

namespace ProjectHubAPI.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<ProjectDto> GetAllProjects()
        {
            return _context.Projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                DueDate = p.DueDate
            }).ToList();
        }

        public ProjectDto GetProjectById(int id)
        {
            var project = _context.Projects.Find(id);
            if (project == null) return null;

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                DueDate = project.DueDate
            };
        }

        public ProjectDto CreateProject(CreateProjectDto dto)
        {
            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                DueDate = dto.DueDate,
                StartDate = System.DateTime.UtcNow,
                EndDate = System.DateTime.UtcNow.AddMonths(1) 
            };

            _context.Projects.Add(project);
            _context.SaveChanges();

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                DueDate = project.DueDate
            };
        }

        public ProjectDto UpdateProject(int id, CreateProjectDto dto)
        {
            var project = _context.Projects.Find(id);
            if (project == null) return null;

            project.Name = dto.Name;
            project.Description = dto.Description;
            project.DueDate = dto.DueDate;

            _context.SaveChanges();

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                DueDate = project.DueDate
            };
        }

        public bool DeleteProject(int id)
        {
            var project = _context.Projects.Find(id);
            if (project == null) return false;

            _context.Projects.Remove(project);
            _context.SaveChanges();
            return true;
        }
    }
}

