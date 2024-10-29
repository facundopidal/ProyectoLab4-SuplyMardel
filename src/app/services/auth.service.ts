import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://lcvt5tbh-8000.brs.devtunnels.ms'; // URL de JSON Server

  constructor(private http: HttpClient, private router: Router) {}

  // Método para iniciar sesión
  login(email: string, password: string): void {
    this.checkAdmin(email, password).subscribe(isAdmin => {
      if (isAdmin) {
        this.setSession('admin');
        this.router.navigate(['/admin']);
      } else {
        this.checkUser(email, password).subscribe(isUser => {
          if (isUser) {
            this.setSession('user');
            this.router.navigate(['/']);
          } else {
            alert('Usuario no encontrado');
          }
        });
      }
    });
  }

  private checkAdmin(email: string, password: string): Observable<boolean> {
    return this.http.get<{ email: string; password: string }>(`${this.apiUrl}/admin`).pipe(
      map(admin => admin.email === email && admin.password === password),
      catchError(() => of(false))
    );
  }

  private checkUser(email: string, password: string): Observable<boolean> {
    return this.http.get<{ email: string; password: string }[]>(`${this.apiUrl}/clients`).pipe(
      map(users => users.some(user => user.email === email && user.password === password)),
      catchError(() => of(false))
    );
  }

  private setSession(role: string): void {
    localStorage.setItem('role', role);
    localStorage.setItem('token', 'dummy-token'); // Simulación de token
  }

  // Verificar si el usuario está logeado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}

