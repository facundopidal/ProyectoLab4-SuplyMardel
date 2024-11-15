import { Component, OnInit } from '@angular/core';
import { Sale } from '../../interfaces/sale';
import { Product } from '../../interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../services/ecommerce/sales.service';
import { ApiProductsService } from '../../services/ecommerce/api-products.service';
import { salesxProducts } from '../../interfaces/salesxProducts';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-sale-details',
  standalone: true,
  imports: [],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.css'
})
export class SaleDetailsComponent implements OnInit{
    sale!: Sale;
    saleProducts: any[] = [];
    productsSale: salesxProducts[] = [];
    productsName: string=''
    
    constructor(
      private route: ActivatedRoute,
      private saleService: SalesService,
      private productsService: ApiProductsService
    ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id){
      this.saleService.getSaleBySaleId(id!).subscribe({
        next: (sale) => {
          this.sale = sale;
          console.log(sale)
        },
        error: (error) => {
          console.error(error)
        }
      })
      ///cargo los productos por cada venta
      // Primero obtenemos los salesxProducts para esta venta
    this.saleService.getProductsBySalesID(id).pipe(
      // Luego hacemos una llamada a `productService.getProductById()` para cada idProduct
      switchMap((salesxProducts: salesxProducts[]) => {
        this.productsSale = salesxProducts;

        // Creamos un array de observables que llaman a `getProductById()` para cada `idProduct`
        const productRequests = salesxProducts.map(saleProduct => 
          this.productsService.getProductById(saleProduct.idProduct)
        );

        // Ejecutamos todas las solicitudes en paralelo con `forkJoin`
        return forkJoin(productRequests);
      })
    ).subscribe({
      next: (products: Product[]) => {
        this.saleProducts = products; // Guardamos el resultado en el array de productos
        this.saleProducts = this.saleProducts.map((product, index) => {
          return {...product, quantity: this.productsSale[index].quantity}
        })
        products.forEach(product => {
          this.productsName += product.name + '\n'
        })
        console.log(products)
        console.log('Productos obtenidos:', this.saleProducts);
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }
    }
  }






