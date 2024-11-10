import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';
import { ApiProductsService } from '../../services/api-products.service';
import { forkJoin } from 'rxjs';
import { MercadoPagoService } from '../../services/mercado-pago.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  productsToBuy: { idProduct: string, quantity: number }[] = [];
  detailedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productsService: ApiProductsService,
    private mpService: MercadoPagoService
  ) {}

  ngOnInit(): void {
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
}
