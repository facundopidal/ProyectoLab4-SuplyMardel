import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000'; // URL de JSON Server

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): void {
    this.checkAdmin(email, password).subscribe(isAdmin => {
      if (isAdmin) {
        this.setSession('admin'); // Establece la sesión como admin
        localStorage.setItem('userId', 'admin'); // Almacena 'admin' como ID
        this.router.navigate(['/admin']);
        this.admin.next(true)
        this.loggedIn.next(true);
      } else {
        this.checkUser(email, password).subscribe(user => {
          if (user) {
            this.setSession('user'); // Establece la sesión como usuario
            localStorage.setItem('userId', user.id.toString()); // Almacena el ID del usuario
            this.router.navigate(['/']);
            this.loggedIn.next(true);
          } else {
            alert('Usuario no encontrado');
          }
        });
      }
    });

  }

  getAdmin(){
    return this.http.get<{email:string,password:string}>(`${this.apiUrl}/admin`)
  }

  updateAdmin(password: string){
    return this.http.put<{email:string,password:string}>(`${this.apiUrl}/admin`,{email: "adminSuplyMardel@gmail.com",password: password})
  }

  private checkAdmin(email: string, password: string): Observable<boolean> {
    return this.http.get<{ email: string; password: string }>(`${this.apiUrl}/admin`).pipe(
      map(admin => admin.email.toUpperCase() === email.toUpperCase() && admin.password === password),
      catchError(() => of(false))
    );
  }

  private checkUser(email: string, password: string): Observable<{ id: number; name: string; lastName: string; email: string; password: string } | null> {
    return this.http.get<{ id: number; name: string; lastName: string; email: string; password: string }[]>(`${this.apiUrl}/clients`).pipe(
      map(users => users.find(user => user.email.toUpperCase() === email.toUpperCase() && user.password === password) || null),
      catchError(() => of(null))
    );
  }

  private setSession(role: string): void {
    localStorage.setItem('role', role);
  }

  // Verificar si el usuario está logeado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId')
  }

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable()

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }
  private admin = new BehaviorSubject<boolean>(this.isAdmin());
  isAdmin$ = this.admin.asObservable()


  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigate(['/'])
    this.loggedIn.next(false)
    this.admin.next(false)
  }

  generateRandomPassword(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  }
}

