import { Component, OnInit } from '@angular/core';
import { Client } from '../../../interfaces/client';
import { ClientsService } from '../../../services/clients/clients.service';
import { ActivatedRoute } from '@angular/router';
import { Sale } from '../../../interfaces/sale';
import { Product } from '../../../interfaces/product';
import { SalesService } from '../../../services/ecommerce/sales.service';
import { forkJoin, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ApiProductsService } from '../../../services/ecommerce/api-products.service';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})
export class ClientDetailsComponent implements OnInit {
  client!: Client;
  clientSales: Sale[] = [];
  saleProductsMap: { [saleId: string]: Product[] } = {};

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientsService, 
    private salesService: SalesService, 
    private productService: ApiProductsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientService.getClientById(id).subscribe({
        next: (client) => {
          this.client = client;
          this.fillSalesArray();
        },
        error: console.error
      });
    }
  }

  fillSalesArray(): void {
    this.salesService.getSalesByClientId(this.client.id).subscribe({
      next: (sales: Sale[]) => {
        this.clientSales = sales;
        console.log('clientSales:', this.clientSales);
        this.fillProductsxSalesArray();
      },
      error: console.error
    });
  }

  fillProductsxSalesArray(): void {
    const productsObservables = this.clientSales.map((sale) =>
      this.salesService.getProductsBySalesID(sale.id).pipe(
        // Aseguramos que saleProducts tenga el tipo correcto
        switchMap((saleProducts: { idProduct: string }[]) => {
          const productRequests = saleProducts.map((sp) =>
            this.productService.getProductById(sp.idProduct)
          );
          return forkJoin(productRequests);
        })
      )
    );

    forkJoin(productsObservables).subscribe({
      next: (results: Product[][]) => {
        results.forEach((products, index) => {
          const saleId = this.clientSales[index].id;
          this.saleProductsMap[saleId] = products;
        });
        console.log('saleProductsMap:', this.saleProductsMap);
      },
      error: console.error
    });
  }
}
