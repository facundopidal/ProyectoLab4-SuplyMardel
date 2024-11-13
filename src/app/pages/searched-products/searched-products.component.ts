import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiProductsService } from '../../services/ecommerce/api-products.service';
import { ProductComponent } from '../../components/product/product.component';
import { AuthService } from '../../services/auth/auth.service';
import { ProductsAdminComponent } from '../admin/products/products.component';

@Component({
  selector: 'app-searched-products',
  standalone: true,
  imports: [ProductComponent,ProductsAdminComponent],
  templateUrl: './searched-products.component.html',
  styleUrls: ['./searched-products.component.css']
})
export class SearchedProductsComponent implements OnInit {
  auth = inject(AuthService);
  isAdmin = this.auth.isAdmin()
  ps = inject(ApiProductsService);
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtenemos los productos al inicializar el componente
    this.ps.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
        this.applyFilter(); // Aplicar filtro en caso de que ya exista una búsqueda
      },
      error: (err) => {
        console.error(err);
      }
    });

    // Nos suscribimos a los cambios en los queryParams
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      this.applyFilter();
    });
  }

  applyFilter() {
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}


