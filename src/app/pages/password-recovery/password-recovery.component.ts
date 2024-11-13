import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ClientsService } from '../../services/clients/clients.service';
import { MailSenderService } from '../../services/external/mail-sender.service';
import { Client } from '../../interfaces/client';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent{
  
  fb = inject(FormBuilder)
  authService = inject(AuthService)
  clientService = inject(ClientsService)
  mailerService = inject(MailSenderService)

  clientNotExistsError: boolean = false

  form = this.fb.nonNullable.group({
    email: ['',[Validators.required, Validators.minLength(12)]]
  })

  onSubmit() {
    if(this.form.invalid) return
    const userEmail = this.form.value.email
    this.clientService.clientExists(userEmail!).subscribe({
      next: (exists) => {
        if(!exists){
          this.clientNotExistsError = true
          console.log("soy gordo")
          return
        }
      },
      error: (error) => {
        console.error(error);
      }
    })

    
    

    const randomPass = this.authService.generateRandomPassword();
    this.mailerService.sendMailToUser(
      userEmail!, 
      "Cambio de contraseña. Si usted no pidio el cambio, ignore el email", 
      "Su nueva contraseña es: " + randomPass
    ).subscribe()

    let clientToChange: Client;

    this.clientService.getClientByEmail(userEmail!).subscribe({
      next: (client) => {

        clientToChange = client
        clientToChange.password = randomPass
        this.clientService.updateClientByID(clientToChange.id, clientToChange).subscribe({
          next: () => {
            console.log("Contraseña actualizada") 
          }
        })
      }
    })
 }

}
