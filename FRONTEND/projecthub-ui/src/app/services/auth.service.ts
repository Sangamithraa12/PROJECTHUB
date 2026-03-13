import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, timeout, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Auth`;







  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(data: any) {
    console.log('>>> [AUTH SERVICE] Starting login request for:', data.email);
    console.log('>>> [AUTH SERVICE] Target URL:', this.apiUrl + '/login');
    
    return this.http.post<any>(this.apiUrl + '/login', data)
      .pipe(
        timeout(7000), 
        map(user => {
          console.log('>>> [AUTH SERVICE] Success! Received user:', user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(err => {
          console.error('>>> [AUTH SERVICE] Error caught in catchError:', err);
          if (err.name === 'TimeoutError') {
            return throwError(() => 'Request timed out. Please check if the API is running.');
          }
          return throwError(() => err);
        })
      );
  }




  logout() {

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next({});
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    const user = this.currentUserValue;
    return !!(user && user.token);
  }

  getUserRole(): string {
    const user = this.currentUserValue;

    const role = user?.user?.role || user?.role || '';
    if (!role) return '';

    const normalized = role.toLowerCase();
    if (normalized.includes('admin')) return 'Admin';
    if (normalized.includes('manager')) return 'Manager';
    if (normalized.includes('employee')) return 'Employee';
    return role;
  }

  getUserId(): number {
    const user = this.currentUserValue;
    return user?.user?.id || user?.id || 0;
  }
}

