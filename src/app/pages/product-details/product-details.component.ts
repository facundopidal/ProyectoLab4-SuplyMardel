import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { ApiProductsService } from '../../services/api-products.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product!: Product
  priceFormatted !: string
  quantity: number = 1;  // Valor inicial de cantidad

  increment() {
    this.quantity += 1;
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  constructor(private route: ActivatedRoute, private productsService: ApiProductsService) { }

  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id')
    this.productsService.getProductById(parseInt(id)).subscribe({
      next: (products) => {
        this.product = products[0]
        this.priceFormatted = this.product.price.toLocaleString('es', { maximumFractionDigits: 20 });
      },
      error: console.error
    })
  }



}
