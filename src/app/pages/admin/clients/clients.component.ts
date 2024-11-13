import { Component, inject, OnInit } from '@angular/core';
import { Client } from '../../../interfaces/client';
import { ClientsService } from '../../../services/clients/clients.service';
import { MenuComponent } from '../menu/menu.component';
import { FilterClientsPipe } from "../../../pipes/filter.pipe";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MenuComponent,
    FilterClientsPipe,
    CommonModule,
    FormsModule,
    RouterLink
],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit{
  clients: Client[] = [];
  cs = inject(ClientsService)
  filterClients = '';

  ngOnInit(): void {
    this.cs.getClients().subscribe({
      next : (res) => {
        this.clients = res
      },
      error : (error) => {console.error(error)}
    })
  }

}
