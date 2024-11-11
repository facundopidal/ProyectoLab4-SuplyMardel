import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { ClientsService } from '../../services/clients.service';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../interfaces/client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NavBarComponent,
    CommonModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{

  clientsService = inject(ClientsService)
  authService = inject(AuthService)
  client!: Client

  ngOnInit(): void {
    const id: any = localStorage.getItem('userId')
    this.clientsService.getClientById(id).subscribe({
        next: (client) => {
            this.client = client
        },
        error: (error) => {console.error(error)}
    })
  }

  logout(): void {
      this.authService.logout()
  }

}
