import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';
import { ProductComponent } from '../../components/product/product.component';
import { ApiProductsService } from '../../services/ecommerce/api-products.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavBarComponent,
    InfoSectionComponent,
    ProductComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  apiProductsService = inject(ApiProductsService)
  products!: Product[]
  ngOnInit(): void {
      this.apiProductsService.getProducts().subscribe({
        next: (products) => {
          this.products = products
        },
        error: console.error
      })
  }
  
}
