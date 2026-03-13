import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { Project, CreateProjectDto } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  userRole: string = '';
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  isProcessing: boolean = false;
  
  newProject: CreateProjectDto = { name: '', description: '', dueDate: '' };
  editingProject: Project = { id: 0, name: '', description: '', dueDate: '' };

  constructor(
    private projectService: ProjectService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userRole = this.auth.getUserRole();
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().pipe(
      timeout(10000),
      catchError(err => {
        console.error('Project loading failed:', err);
        return of([]);
      })
    ).subscribe((data: Project[]) => {
      this.projects = data;
      this.cdr.detectChanges();
    });
  }

  createProject(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.projectService.createProject(this.newProject).pipe(
      finalize(() => this.isProcessing = false)
    ).subscribe(() => {
      this.loadProjects();
      this.showCreateModal = false;
      this.newProject = { name: '', description: '', dueDate: '' };
    });
  }

  openEditModal(project: Project): void {
    this.editingProject = { ...project };
    this.showEditModal = true;
  }

  updateProject(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;
    const dto: CreateProjectDto = {
        name: this.editingProject.name,
        description: this.editingProject.description,
        dueDate: this.editingProject.dueDate
    };
    this.projectService.updateProject(this.editingProject.id, dto).pipe(
      finalize(() => this.isProcessing = false)
    ).subscribe(() => {
      this.loadProjects();
      this.showEditModal = false;
    });
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => {
        this.loadProjects();
      });
    }
  }
}

