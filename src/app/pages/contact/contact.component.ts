import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailSenderService } from '../../services/mail-sender.service';
import { AuthService } from '../../services/auth.service';
import { ClientsService } from '../../services/clients.service';
import { Client } from '../../interfaces/client';
import { RouterLink } from '@angular/router';
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
      next: (res) => {console.log(res)},
      error: console.error
    })
  }

}
