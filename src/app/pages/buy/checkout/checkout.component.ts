import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../interfaces/product';
import { ApiProductsService } from '../../../services/ecommerce/api-products.service';
import { forkJoin } from 'rxjs';
import { MercadoPagoService } from '../../../services/external/mercado-pago.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  productsToBuy: { idProduct: string, quantity: number }[] = [];
  detailedProducts: any[] = [];
  selectedOption: number = 1;

  
  constructor(
    private route: ActivatedRoute,
    private productsService: ApiProductsService,
    private mpService: MercadoPagoService
  ) {}

  ngOnInit(): void {
    this.calculateTotals();
    this.route.queryParams.subscribe(params => {
      if (params['products']) {
        try {
          this.productsToBuy = JSON.parse(decodeURIComponent(params['products']));
          this.fetchProductDetails();
        } catch (e) {
          console.error('Error parsing products:', e);
        }
      }
    });
  }

  fetchProductDetails(): void {
    const productIds = this.productsToBuy.map(p => p.idProduct);
    const productObservables = productIds.map(id => this.productsService.getProductById(id));

    forkJoin(productObservables).subscribe({
      next: products => {
        this.detailedProducts = products.map((product, index) => ({
          ...product,
          quantity: this.productsToBuy[index].quantity
        }));
        console.log(this.detailedProducts)
        this.redirectMercadoPago(this.detailedProducts)
      },
      error: err => console.error('Error fetching product details:', err)
    });
  }

  redirectMercadoPago(products: Product[]) {
    console.log(products)
    this.mpService.goToPay(products).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: console.error
    })
  }

  shippingCost: number = 1000;
  subtotal: number = 0;
  total: number = 0;


  calculateTotals(): void {
    this.subtotal = this.detailedProducts.reduce((acc: number, product: any) => acc + product.price * product.quantity, 0);
    this.total = this.subtotal + this.shippingCost;
  }

  selectOption(option: number): void {
    this.selectedOption = option;
  }
}
