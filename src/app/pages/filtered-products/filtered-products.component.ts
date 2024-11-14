import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { ApiProductsService } from '../../services/ecommerce/api-products.service';
import { Product } from '../../interfaces/product';
import { ProductComponent } from '../../components/product/product.component';
import { AuthService } from '../../services/auth/auth.service';
import { ProductsAdminComponent } from '../admin/products/products.component';

@Component({
  selector: 'app-filtered-products',
  standalone: true,
  imports: [NavBarComponent, ProductComponent, ProductsAdminComponent],
  templateUrl: './filtered-products.component.html',
  styleUrls: ['./filtered-products.component.css']
})
export class FilteredProductsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  productsService = inject(ApiProductsService);
  authService = inject(AuthService)
  products: Product[] = [];

  // Listas de categorías y marcas
  categories = ['Proteinas', 'Creatinas', 'Aminoácidos', 'Preentreno'];
  brands = ['ENA', 'Star Nutrition', 'Xtrenght', 'Body Advance', 'Nutrilab'];
  
  isAdmin: boolean = this.authService.isAdmin()


  ngOnInit(): void {
    // Nos suscribimos a los cambios en los parámetros de la URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      const type = params.get('type');
      const param = params.get('param');

      if (type && param) {
        if (type === 'brands') {
          this.loadProductsByBrand(param);
        } else if (type === 'categories') {
          this.loadProductsByCategory(param);
        } else {
          this.router.navigate(['/']); // Navega a la página de inicio si el tipo no coincide
        }
      } else {
        this.router.navigate(['/']); // Navega a la página de inicio si faltan parámetros
      }
    });
  }

  private loadProductsByBrand(brand: string): void {
    if (!this.brands.includes(brand)) {
      this.router.navigate(['/']);
      return;
    }
    this.productsService.getProductsByBrand(brand).subscribe({
      next: (products) => {
        this.products = products;
        console.log('Productos por marca:', products);
      },
      error: console.error
    });
  }

  private loadProductsByCategory(category: string): void {
    if (!this.categories.includes(category)) {
      this.router.navigate(['/']);
      return;
    }
    this.productsService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.products = products;
        console.log('Productos por categoría:', products);
      },
      error: console.error
    });
  }
}
