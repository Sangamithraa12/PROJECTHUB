using ProjectHubAPI.DTOs;
using System.Collections.Generic;

namespace ProjectHubAPI.Services
{
    public interface ITaskService
    {
        IEnumerable<TaskDto> GetAllTasks();
        TaskDto GetTaskById(int id);
        TaskDto CreateTask(CreateTaskDto taskDto);
        TaskDto UpdateTask(int id, CreateTaskDto taskDto);
        bool DeleteTask(int id);
        bool AssignTask(int taskId, int userId);
        bool UpdateStatus(int taskId, string status);
        CommentDto AddComment(int taskId, int userId, string content);
        CommentDto UpdateComment(int commentId, string content);
        bool DeleteComment(int commentId);
    }
}
