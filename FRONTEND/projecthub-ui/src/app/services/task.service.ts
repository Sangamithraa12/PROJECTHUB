import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TaskItem, CreateTaskDto, Comment } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = `${environment.apiUrl}/Task`;

  constructor(private http: HttpClient) { }

  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl);
  }

  createTask(task: CreateTaskDto): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, task);
  }

  updateTask(id: number, task: CreateTaskDto): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignTask(taskId: number, userId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/${taskId}/assign`, userId, { responseType: 'text' });
  }

  updateStatus(taskId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${taskId}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  addComment(taskId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${taskId}/comment`, `"${content}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateComment(commentId: number, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/comment/${commentId}`, `"${content}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comment/${commentId}`);
  }
}

