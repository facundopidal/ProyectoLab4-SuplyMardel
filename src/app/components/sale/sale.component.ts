import { Component, inject, Input, OnInit } from '@angular/core';
import { Sale } from '../../interfaces/sale';
import { RouterLink } from '@angular/router';
import { SalesService } from '../../services/ecommerce/sales.service';
import { salesxProducts } from '../../interfaces/salesxProducts';
import { Product } from '../../interfaces/product';
import { switchMap, forkJoin } from 'rxjs';
import { ApiProductsService } from '../../services/ecommerce/api-products.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent implements OnInit {
  private saleService = inject(SalesService);
  private productService = inject(ApiProductsService);

  @Input() sale!: Sale;
  productsSale: salesxProducts[] = [];
  products: Product[] = []; // Array para almacenar los productos obtenidos
  productsName: string=''
  ngOnInit(): void {
    // Primero obtenemos los salesxProducts para esta venta
    this.saleService.getProductsBySalesID(this.sale.id).pipe(
      // Luego hacemos una llamada a `productService.getProductById()` para cada idProduct
      switchMap((salesxProducts: salesxProducts[]) => {
        this.productsSale = salesxProducts;

        // Creamos un array de observables que llaman a `getProductById()` para cada `idProduct`
        const productRequests = salesxProducts.map(saleProduct => 
          this.productService.getProductById(saleProduct.idProduct)
        );

        // Ejecutamos todas las solicitudes en paralelo con `forkJoin`
        return forkJoin(productRequests);
      })
    ).subscribe({
      next: (products: Product[]) => {
        this.products = products; // Guardamos el resultado en el array de productos
        products.forEach(product => {
          this.productsName += product.name + '\n'
        })
        console.log(products)
        console.log('Productos obtenidos:', this.products);
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }
}
