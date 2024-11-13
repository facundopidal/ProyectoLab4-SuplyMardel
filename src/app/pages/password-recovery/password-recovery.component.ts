import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ClientsService } from '../../services/clients/clients.service';
import { MailSenderService } from '../../services/external/mail-sender.service';
import { Client } from '../../interfaces/client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent {

  fb = inject(FormBuilder)
  authService = inject(AuthService)
  clientService = inject(ClientsService)
  mailerService = inject(MailSenderService)
  router = inject(Router)

  clientNotExistsError: boolean = false
  isSubmit: boolean = false

  formEmail = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.minLength(12)]]
  })

  formRecovery = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    repeatNewPassword: ['', [Validators.required, Validators.minLength(8)]]
  })

  randomPass: string = this.authService.generateRandomPassword();
  clientToChange?: Client
  
  onSubmit() {
    if (this.formEmail.invalid) return
    const userEmail = this.formEmail.value.email

    this.clientService.getClientByEmail(userEmail!).subscribe({
      next: (client) => {
        if (!client) {
          this.clientNotExistsError = true
          return
        }
        this.clientToChange = client
        this.isSubmit = true
        this.mailerService.sendMailToUser(
          userEmail!,
          "Cambio de contraseña. Si usted no pidio el cambio, ignore el email",
          "Su codigo es este: " + this.randomPass
        ).subscribe({
          next: () => {
            this.isSubmit = true
          },
          error: () => {
            this.isSubmit = false
            alert("Ocurrio un error")
          }
        })

        let clientToChange: Client;

        clientToChange = client
        clientToChange.password = this.randomPass
        
      }
    })
  }

  onChange() {
    if(this.formRecovery.invalid) return
    if (this.randomPass !==  this.formRecovery.get('code')?.value) return;
    const password = this.formRecovery.value.newPassword
    const repeatPassword = this.formRecovery.value.repeatNewPassword

    if(password !== repeatPassword) return

    this.clientToChange!.password = password!

    this.clientService.updateClientByID(this.clientToChange!.id, this.clientToChange!).subscribe({
      next: () => {
        console.log("Contraseña actualizada")
        this.router.navigate(['/login'])
      }
    })

    
  }



}