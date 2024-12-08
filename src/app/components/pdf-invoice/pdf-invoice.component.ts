import { Component, Input, OnInit } from '@angular/core';
import { PdfService } from '../../services/external/pdf.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../interfaces/product';
import { SalesService } from '../../services/ecommerce/sales.service';
import { Sale } from '../../interfaces/sale';
import { switchMap, forkJoin } from 'rxjs';
import { salesxProducts } from '../../interfaces/salesxProducts';
import { ApiProductsService } from '../../services/ecommerce/api-products.service';

@Component({
  selector: 'app-invoice-generator',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pdf-invoice.component.html',
  styleUrl: './pdf-invoice.component.css',
})
export class PdfInvoice implements OnInit{
  invoiceForm: FormGroup;

  @Input() saleId!: string

  sale!: Sale

  saleProducts: Product[] = []
  productsSale: salesxProducts[] = []

  constructor(private pdfService: PdfService, private fb: FormBuilder, private saleService: SalesService, private productsService: ApiProductsService) {
    this.invoiceForm = this.fb.group({
      cliente: ['', Validators.required],
      fecha: ['', Validators.required],
      productos: this.fb.array([]),
      total: ['', Validators.required],
    });
  }

  ngOnInit(): void {

      this.saleService.getSaleBySaleId(this.saleId!).subscribe({
        next: (sale) => {
          this.sale = sale;
        },
        error: (error) => {
          console.error(error)
        }
      })
      ///cargo los productos por cada venta
      // Primero obtenemos los salesxProducts para esta venta
      this.saleService.getProductsBySalesID(this.saleId!).pipe(
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
            return { ...product, quantity: this.productsSale[index].quantity }
          })
         
        },
        error: (error) => {
          console.error('Error al obtener los productos:', error);
        }
      });
    
  }

  generatePDF() {
      this.pdfService.generateInvoice(this.invoiceForm.value);
  }
}
