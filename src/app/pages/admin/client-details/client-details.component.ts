import { Component, OnInit } from '@angular/core';
import { Client } from '../../../interfaces/client';
import { ClientsService } from '../../../services/clients/clients.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})
export class ClientDetailsComponent implements OnInit {
  client!: Client
  constructor(private route: ActivatedRoute, private clientService: ClientsService) {}
  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id')
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.client = client;
      },
      error: console.error
    })
  }
}
