import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailSenderService } from '../../services/external/mail-sender.service';
import { AuthService } from '../../services/auth/auth.service';
import { ClientsService } from '../../services/clients/clients.service';
import { Client } from '../../interfaces/client';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NavBarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit{
  fb = inject(FormBuilder)
  router = inject(Router)
  private mailService = inject(MailSenderService)
  private authService = inject(AuthService)
  private clientService = inject(ClientsService)
  id?: string | null
  email: string = ''
  ngOnInit(): void {
    
    this.id = this.authService.getUserId()

    if(this.id && this.id !== "admin"){
      this.clientService.getClientById(this.id).subscribe({
        next: (client) => {
          this.email= client.email
          const email = this.form.get('userEmail')
          email?.setValue(this.email)
        },
        error: console.error
      })
    }
  }

  form = this.fb.nonNullable.group({
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]],
    userEmail: [this.email, [Validators.required, Validators.email]]
  })


  sendMail() {
    if(this.form.invalid) return
    const {subject, message, userEmail} = this.form.getRawValue()

    this.mailService.sendMailToAdmin(subject, message, userEmail).subscribe({
      next: (res) => {
        console.log(res)
        alert("Correo enviado correctamente!")
        this.router.navigate(['/'])
      },
      error: (error) => {
        console.error(error)
        alert("Ocurrio un error al enviar")
        this.router.navigate(['/'])
      } 
    })
  }

}
