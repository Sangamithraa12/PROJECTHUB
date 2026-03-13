import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';


import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  userRole: string = '';
  stats = {
    projects: 0,
    tasks: 0,


    completedTasks: 0,
    pendingTasks: 0
  };
  myTasks: any[] = [];

  constructor(
    private auth: AuthService,
    private projectService: ProjectService,
    private taskService: TaskService,


    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
    this.userRole = this.auth.getUserRole();
    this.loadStats();
  }

  loadStats(): void {
    this.projectService.getProjects().pipe(
      timeout(8000),
      catchError(err => {
        console.error('Dashboard Project load failed:', err);
        return of([]);
      })
    ).subscribe((projects: any) => {
      this.stats.projects = projects.length;
      this.cdr.detectChanges();
    });

    this.taskService.getTasks().pipe(

      timeout(10000),
      catchError(err => {
        console.error('Dashboard Task load failed:', err);
        return of([]);
      })
    ).subscribe((tasks: any) => {
      this.stats.tasks = tasks.length;
      this.stats.completedTasks = tasks.filter((t: any) => t.status === 'Completed').length;
      this.stats.pendingTasks = tasks.length - this.stats.completedTasks;

      const userId = this.auth.getUserId();
      this.myTasks = tasks.filter((t: any) => t.assignedTo === userId);
      
      this.cdr.detectChanges();
    });
  }

  logout(): void {
    this.auth.logout();
  }
}

