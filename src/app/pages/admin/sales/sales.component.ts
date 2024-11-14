import { Component, inject, OnInit } from '@angular/core';
import { Sale } from '../../../interfaces/sale';
import { SalesService } from '../../../services/ecommerce/sales.service';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { SaleComponent } from '../../../components/sale/sale.component';
import { MenuComponent } from "../menu/menu.component";
import { AuthService } from '../../../services/auth/auth.service';
import { Client } from '../../../interfaces/client';
import { ClientsService } from '../../../services/clients/clients.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [NavBarComponent, SaleComponent, MenuComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit{

  saleService = inject(SalesService)
  authService = inject(AuthService)
  clientsService = inject(ClientsService)
  sales: Sale[] = []
  client?: Client
  isAdmin = this.authService.isAdmin()
  
  ngOnInit(): void {
    if(this.isAdmin) {
      this.getAllSales()
    }
    else {
      const id = this.authService.getUserId()
      this.clientsService.getClientById(id!).subscribe({
        next: (client) => {
          this.client = client
          this.getSalesByCLient(client.id)
        },
        error: console.error
      })
      
    }
  }

  getAllSales() {
    this.saleService.getSales().subscribe({
      next: (sales) => {
        this.sales = sales
      }
    })
  }

  getSalesByCLient(idClient: string) {
    this.saleService.getSalesByClientId(idClient).subscribe({
      next: (sales) => {
        this.sales = sales
      }
    })
  }

}
