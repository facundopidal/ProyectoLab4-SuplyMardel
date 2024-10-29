import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ProductsAdminComponent } from '../products/products.component';
import { Product } from '../../../interfaces/product.js';
import { ApiProductsService } from '../../../services/api-products.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MenuComponent, ProductsAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  constructor(private productsService: ApiProductsService) {}

  products: Product[] = [];
  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.productsService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (error: Error) => {
        console.error(error.message);
      },
    });
  }

  onEditProduct(productId: number) {
    console.log('Edit product with ID:', productId);
    // Lógica para editar el producto
  }

  onDeleteProduct(productId: number) {
    console.log('Delete product with ID:', productId);
    // Lógica para eliminar el producto
  }
}
