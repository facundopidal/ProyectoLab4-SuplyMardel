import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ClientsService } from '../../../services/clients/clients.service';
import { MailSenderService } from '../../../services/external/mail-sender.service';

@Component({
  selector: 'app-change-password-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password-admin.component.html',
  styleUrl: './change-password-admin.component.css',
})
export class ChangePasswordAdminComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  clientService = inject(ClientsService);
  mailerService = inject(MailSenderService);
  router = inject(Router);

  formRecovery = this.fb.nonNullable.group({
    actualPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    repeatNewPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  admin: any 
  passwordCurrently?: string;
  OldPasswordRepeated = false;
  NotSamePassword = false;
  IncorrectPassword = false;
  
  ngOnInit() {
    this.authService.getAdmin().subscribe({
      next: (admin) => {
        this.admin = admin
        this.passwordCurrently = admin.password
      }
    });

  }


  onChange() {
    if (this.formRecovery.invalid) return;
    const actualPassword = this.formRecovery.get('actualPassword')?.value
    const newPassword = this.formRecovery.get('newPassword')?.value;
    const repeatNewPassword = this.formRecovery.get('repeatNewPassword')?.value;

    if (actualPassword != this.passwordCurrently) {
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

    this.admin.password = this.formRecovery.value.newPassword;
    this.authService.updateAdmin(this.formRecovery.value.newPassword!).subscribe({
      next: (admin) => {
        alert('Contraseña cambiada con éxito');
      },
      error: console.error,
    });
  }
}
