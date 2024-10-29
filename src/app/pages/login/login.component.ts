import { Component } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login', ///cuidado con esto, que antes decía "app-login-admin"
  standalone: true,
  imports: [
    NavBarComponent,
    FormsModule
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

