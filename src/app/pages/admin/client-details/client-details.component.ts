import { Component, OnInit } from '@angular/core';
import { Client } from '../../../interfaces/client';
import { ClientsService } from '../../../services/clients/clients.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Sale } from '../../../interfaces/sale';
import { Product } from '../../../interfaces/product';
import { SalesService } from '../../../services/ecommerce/sales.service';
import { forkJoin, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ApiProductsService } from '../../../services/ecommerce/api-products.service';
import { SaleComponent } from '../../../components/sale/sale.component';
import { ClientComponent } from '../../../components/client/client.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, SaleComponent, ClientComponent, MenuComponent],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})
export class ClientDetailsComponent implements OnInit {
  client!: Client;
  clientSales: Sale[] = [];

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientsService, 
    private salesService: SalesService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientService.getClientById(id).subscribe({
        next: (client) => {
          this.client = client;
        },
        error: console.error
      });
      this.salesService.getSalesByClientId(id).subscribe({
        next: (sales: Sale[]) => {
          this.clientSales = sales;
          console.log('clientSales:', this.clientSales);
        },
        error: console.error
      });
    }
  }

  

  // fillProductsxSalesArray(): void {
  //   const productsObservables = this.clientSales.map((sale) =>
  //     this.salesService.getProductsBySalesID(sale.id).pipe(
  //       // Aseguramos que saleProducts tenga el tipo correcto
  //       switchMap((saleProducts: { idProduct: string }[]) => {
  //         const productRequests = saleProducts.map((sp) =>
  //           this.productService.getProductById(sp.idProduct)
  //         );
  //         return forkJoin(productRequests);
  //       })
  //     )
  //   );

  //   forkJoin(productsObservables).subscribe({
  //     next: (results: Product[][]) => {
  //       results.forEach((products, index) => {
  //         const saleId = this.clientSales[index].id;
  //         this.saleProductsMap[saleId] = products;
  //       });
  //       console.log('saleProductsMap:', this.saleProductsMap);
  //     },
  //     error: console.error
  //   });
  // }
}
