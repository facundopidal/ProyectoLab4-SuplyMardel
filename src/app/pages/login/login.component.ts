import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login', ///cuidado con esto, que antes decía "app-login-admin"
  standalone: true,
  imports: [
    NavBarComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
    
    constructor(private authService: AuthService) {}

    fb = inject(FormBuilder)

    form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.minLength(12), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })

    login(): void {
      if(this.form.invalid) {
        return
      } 
      const {email, password} = this.form.getRawValue()
      this.authService.login(email, password);
    }

  }

