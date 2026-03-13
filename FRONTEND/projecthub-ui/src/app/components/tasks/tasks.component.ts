import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { TaskItem, Project, CreateTaskDto, Comment } from '../../models/project.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: TaskItem[] = [];
  projects: Project[] = [];
  users: any[] = [];

  userRole: string = '';
  currentUserId: number = 0;
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  isCreatingTask: boolean = false;
  isUpdatingTask: boolean = false;
  
  newTask: CreateTaskDto = { title: '', status: 'Pending', projectId: 0, assignedTo: 0 };
  editingTask: TaskItem = { id: 0, title: '', status: '', projectId: 0, assignedTo: 0 };

  commentInputs: { [key: number]: string } = {};
  editingCommentId: number | null = null;
  editCommentContent: string = '';

  constructor(
    public taskService: TaskService,
    public projectService: ProjectService,
    private userService: UserService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userRole = this.auth.getUserRole();
    this.currentUserId = this.auth.getUserId();
    this.loadTasks();
    this.loadProjects();
    this.loadUsers();
  }

  openCreateModal(): void {
    this.loadUsers();
    this.showCreateModal = true;
  }

  loadTasks(): void {
    this.taskService.getTasks().pipe(
      timeout(10000),
      catchError(err => {
        console.error('Task loading failed:', err);
        return of([]);
      })
    ).subscribe((data: TaskItem[]) => {
      this.tasks = data;
      this.cdr.detectChanges();
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().pipe(
      timeout(8000),
      catchError(err => {
        console.error('Project loading failed:', err);
        return of([]);
      })
    ).subscribe((data: Project[]) => {
      this.projects = data;
      this.cdr.detectChanges();
    });
  }

  isLoadingUsers: boolean = false;
  userLoadError: string = '';

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userLoadError = '';
    
    this.userService.getUsers().pipe(
      timeout(10000),
      catchError(error => {
        console.error('User fetch failed or timed out:', error);
        this.userLoadError = 'Connection failed. Please check if API is running.';
        return of([]);
      }),
      finalize(() => {
        this.isLoadingUsers = false;
      })
    ).subscribe(
      (data: any[]) => {
        if (!data || !Array.isArray(data)) {
          this.users = [];
          return;
        }
        this.users = data
          .map(u => ({
            id: u.id || u.Id,
            name: u.name || u.Name || 'Unknown User',
            email: u.email || u.Email || '',
            roleName: u.roleName || u.RoleName || (u.role && u.role.name) || (u.Role && u.Role.Name) || 'Member'
          }))
          .filter(u => u.roleName.toLowerCase().includes('employee'));
        this.cdr.detectChanges();
      }
    );
  }

  createTask(): void {
    if (this.isCreatingTask) return;
    this.isCreatingTask = true;
    this.cdr.detectChanges();

    this.taskService.createTask(this.newTask).pipe(
      timeout(10000),
      catchError(err => {
        console.error('Task creation failed:', err);
        return of(null);
      }),
      finalize(() => {
        this.isCreatingTask = false;
        this.cdr.detectChanges();
      })
    ).subscribe((res) => {
      if (res) {
        this.loadTasks();
        this.showCreateModal = false;
        this.newTask = { title: '', status: 'Pending', projectId: 0, assignedTo: 0 };
      }
    });
  }

  updateStatus(taskId: number, event: any): void {
    const status = event.target.value;
    this.taskService.updateStatus(taskId, status).subscribe(() => {
      this.loadTasks();
    });
  }

  addComment(taskId: number): void {
    const content = this.commentInputs[taskId];
    if (content && content.trim()) {
      this.taskService.addComment(taskId, content).subscribe(() => {
        this.commentInputs[taskId] = '';
        this.loadTasks();
      });
    }
  }

  startEditComment(comment: Comment): void {
    this.editingCommentId = comment.id;
    this.editCommentContent = comment.content;
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editCommentContent = '';
  }

  updateComment(commentId: number): void {
    if (this.editCommentContent && this.editCommentContent.trim()) {
      this.taskService.updateComment(commentId, this.editCommentContent).subscribe(() => {
        this.editingCommentId = null;
        this.editCommentContent = '';
        this.loadTasks();
      });
    }
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.taskService.deleteComment(commentId).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  openEditModal(task: TaskItem): void {
    this.editingTask = { ...task };
    this.loadUsers();
    this.showEditModal = true;
  }

  updateTask(): void {
    if (this.isUpdatingTask) return;
    this.isUpdatingTask = true;
    this.cdr.detectChanges();

    const dto: CreateTaskDto = {
        title: this.editingTask.title,
        status: this.editingTask.status,
        projectId: this.editingTask.projectId,
        assignedTo: this.editingTask.assignedTo
    };

    this.taskService.updateTask(this.editingTask.id, dto).pipe(
      timeout(10000),
      catchError(err => {
        console.error('Task update failed:', err);
        return of(null);
      }),
      finalize(() => {
        this.isUpdatingTask = false;
        this.cdr.detectChanges();
      })
    ).subscribe((res) => {
      if (res) {
        this.loadTasks();
        this.showEditModal = false;
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }
}

