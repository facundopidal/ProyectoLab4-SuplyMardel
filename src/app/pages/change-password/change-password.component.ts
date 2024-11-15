import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ClientsService } from '../../services/clients/clients.service';
import { Client } from '../../interfaces/client';
import { Router } from '@angular/router';
import { MailSenderService } from '../../services/external/mail-sender.service';


@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  router = inject(Router);
  fb = inject(FormBuilder);
  cs = inject(ClientsService);
  ms = inject(MailSenderService)
  private authS = inject(AuthService);
  actualUser?: Client;
  ngOnInit(): void {
    const actualUserID = this.authS.getUserId();
    this.cs.getClientById(actualUserID!).subscribe({
      next: (client) => { this.actualUser = client },
      error: (error) => { console.error(error) }
    })
  }

  passwordForm = this.fb.nonNullable.group({
    actualPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    repeatNewPassword: ['', [Validators.required]]
  });

  OldPasswordRepeated = false;
  NotSamePassword = false;
  IncorrectPassword = false;

  onSubmit(): void {
    if (this.passwordForm.invalid) return;
    const actualPassword = this.passwordForm.get('actualPassword')?.value
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const repeatNewPassword = this.passwordForm.get('repeatNewPassword')?.value;

    if (actualPassword != this.actualUser?.password) {
      this.IncorrectPassword = true;
      return;
    }
    if (actualPassword == newPassword) {
      this.OldPasswordRepeated = true;
      return;
    }
    if (newPassword != repeatNewPassword) {
      this.NotSamePassword = true;
      return;
    }
    if (!this.actualUser) {
      alert("Ocurrio un erorr")
      console.log(this.actualUser);

      return;
    }

    this.actualUser!.password = newPassword!;

    this.cs.updateClientByID(this.actualUser?.id!, this.actualUser!).subscribe({
      next: (client) => {
        alert("Contraseña cambiada con éxtio")


        this.ms.sendMailToUser(
          this.actualUser!.email,
          "SuplyMardel Cambio de contraseña.",
          "En este preciso momento " + this.formatDate(Date()) + " se realizó un cambio de contraseña en SuplyMardel"
        ).subscribe({
          next: (res) => {
            console.log(res)

          },
          error: (e) => {
            console.error(e)

          }
        })
        this.router.navigate(['/']);
      },
      error: (error) => { console.error(error) }
    })

  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date).replace(',', '');
  }

}
