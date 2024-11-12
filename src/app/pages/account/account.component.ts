import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { ClientsService } from '../../services/clients/clients.service';
import { AuthService } from '../../services/auth/auth.service';
import { Client } from '../../interfaces/client';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AddressesService } from '../../services/clients/adresses.service';
import { Address } from '../../interfaces/address';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NavBarComponent,
    CommonModule,RouterLink
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{

  clientsService = inject(ClientsService)
  authService = inject(AuthService)
  addressService = inject(AddressesService)
  client!: Client
  route = inject(Router)
  clientAddresses?: Address[]
  limitAddresses: boolean = false

  ngOnInit(): void {
    const id: string = this.authService.getUserId()!
    if(!id) this.route.navigate(['/'])
    this.clientsService.getClientById(id).subscribe({
        next: (client) => {
            this.client = client
        },
        error: (error) => {console.error(error)}
    })

    this.addressService.getAddressesByClient(id).subscribe({
      next: (addresses) => {
        this.clientAddresses = addresses  
        if(this.clientAddresses.length === 3)
          this.limitAddresses = true
      },
      error: console.error
    })
  }

  deleteAddress(idAddress: string) {
    this.addressService.deleteAddressByID(idAddress).subscribe({
      next: () => {
        this.limitAddresses = false
      },
      error: console.error
    })
  }

  logout(): void {
      this.authService.logout()
  }

}
