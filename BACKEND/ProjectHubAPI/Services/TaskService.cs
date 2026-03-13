using Microsoft.EntityFrameworkCore;
using ProjectHubAPI.Data;
using ProjectHubAPI.DTOs;
using ProjectHubAPI.Models;
using ProjectHubAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectHubAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<TaskDto> GetAllTasks()
        {
            return _context.Tasks
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Status = t.Status,
                    ProjectId = t.ProjectId,
                    ProjectName = _context.Projects.Where(p => p.Id == t.ProjectId).Select(p => p.Name).FirstOrDefault(),
                    AssignedTo = t.AssignedTo,
                    AssignedToName = _context.Users.Where(u => u.Id == t.AssignedTo).Select(u => u.Name).FirstOrDefault(),
                    Comments = _context.Comments
                        .Where(c => c.TaskId == t.Id)
                        .OrderByDescending(c => c.CreatedAt)
                        .Select(c => new CommentDto
                        {
                            Id = c.Id,
                            Content = c.Content,
                            UserId = c.UserId,
                            UserName = _context.Users.Where(u => u.Id == c.UserId).Select(u => u.Name).FirstOrDefault(),
                            CreatedAt = c.CreatedAt
                        }).ToList()
                }).ToList();
        }

        public TaskDto GetTaskById(int id)
        {
            var t = _context.Tasks.Find(id);
            if (t == null) return null;

            return new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                ProjectId = t.ProjectId,
                ProjectName = _context.Projects.Where(p => p.Id == t.ProjectId).Select(p => p.Name).FirstOrDefault(),
                AssignedTo = t.AssignedTo,
                AssignedToName = _context.Users.Where(u => u.Id == t.AssignedTo).Select(u => u.Name).FirstOrDefault(),
                Comments = _context.Comments
                    .Where(c => c.TaskId == t.Id)
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new CommentDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        UserId = c.UserId,
                        UserName = _context.Users.Where(u => u.Id == c.UserId).Select(u => u.Name).FirstOrDefault(),
                        CreatedAt = c.CreatedAt
                    }).ToList()
            };
        }

        public TaskDto CreateTask(CreateTaskDto dto)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Status = dto.Status,
                ProjectId = dto.ProjectId,
                AssignedTo = dto.AssignedTo
            };

            _context.Tasks.Add(task);
            _context.SaveChanges();

            return GetTaskById(task.Id);
        }

        public TaskDto UpdateTask(int id, CreateTaskDto dto)
        {
            var task = _context.Tasks.Find(id);
            if (task == null) return null;

            task.Title = dto.Title;
            task.Status = dto.Status;
            
            _context.SaveChanges();
            return GetTaskById(id);
        }

        public bool DeleteTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            return true;
        }

        public bool AssignTask(int taskId, int userId)
        {
            var task = _context.Tasks.Find(taskId);
            var user = _context.Users.Find(userId);

            if (task == null || user == null) return false;

            var assignment = new TaskAssignment { TaskId = taskId, UserId = userId };
            _context.TaskAssignments.Add(assignment);
            task.AssignedTo = userId;
            
            _context.SaveChanges();
            return true;
        }

        public bool UpdateStatus(int taskId, string status)
        {
            var task = _context.Tasks.Find(taskId);
            if (task == null) return false;

            task.Status = status;
            _context.SaveChanges();
            return true;
        }

        public CommentDto AddComment(int taskId, int userId, string content)
        {
            var task = _context.Tasks.Find(taskId);
            if (task == null) return null;

            var comment = new Comment
            {
                TaskId = taskId,
                UserId = userId,
                Content = content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            _context.SaveChanges();

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                UserId = comment.UserId,
                UserName = _context.Users.Where(u => u.Id == comment.UserId).Select(u => u.Name).FirstOrDefault(),
                CreatedAt = comment.CreatedAt
            };
        }

        public CommentDto UpdateComment(int commentId, string content)
        {
            var comment = _context.Comments.Find(commentId);
            if (comment == null) return null;

            comment.Content = content;
            _context.SaveChanges();

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                UserId = comment.UserId,
                UserName = _context.Users.Where(u => u.Id == comment.UserId).Select(u => u.Name).FirstOrDefault(),
                CreatedAt = comment.CreatedAt
            };
        }

        public bool DeleteComment(int commentId)
        {
            var comment = _context.Comments.Find(commentId);
            if (comment == null) return false;

            _context.Comments.Remove(comment);
            _context.SaveChanges();
            return true;
        }
    }
}
