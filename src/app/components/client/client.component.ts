import { Component, Input, OnInit } from '@angular/core';
import { Address } from '../../interfaces/address';
import { Client } from '../../interfaces/client';
import { AddressesService } from '../../services/clients/adresses.service';


@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {
  @Input() client!: Client;
  addresses: Address[] = [];

  constructor(private addressesService: AddressesService) {}

  ngOnInit(): void {
    if (this.client && this.client.id) {
      this.addressesService.getAddressesByClient(this.client.id).subscribe({
        next: (addresses) => {
          this.addresses = addresses;
          console.log('Direcciones obtenidas:', this.addresses);
        },
        error: (error) => {
          console.error('Error al obtener las direcciones:', error);
        }
      });
    }
  }
}

