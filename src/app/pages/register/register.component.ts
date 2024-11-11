import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients/clients.service';
import { AuthService } from '../../services/auth/auth.service';
import { Client } from '../../interfaces/client';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  router = inject(Router);
  fb = inject(FormBuilder);
  clientsServ = inject(ClientsService);
  authServ = inject(AuthService);

  alreadyExists: boolean = false

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    password2: ['', Validators.required],
  })

  register() {
    if (this.registerForm.invalid) return;
    const pass1 = this.registerForm.get('passsword')?.value
    const pass2 = this.registerForm.get('passsword2')?.value

    if (pass1 != pass2) return;

    const { password2, ...newClient } = this.registerForm.getRawValue()

    this.clientsServ.clientExists(newClient.email).subscribe({
      next: (exists) => {
        this.alreadyExists = exists
        if (this.alreadyExists) return

        this.clientsServ.registerClient(newClient).subscribe({
          next: (created) => {
            if (created) {
              this.authServ.login(newClient.email, newClient.password)
              this.router.navigate(['/'])
              alert("Se registró exitosamente!")
            }
          }
        })
      }
    })

  }


}
