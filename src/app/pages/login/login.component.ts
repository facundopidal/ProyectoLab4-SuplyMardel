import { Component } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login', ///cuidado con esto, que antes decía "app-login-admin"
  standalone: true,
  imports: [
    NavBarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
    email: string = '';
    password: string = '';
  
    constructor(private authService: AuthService) {}
  
    login(): void {
      this.authService.login(this.email, this.password);
    }

  }
