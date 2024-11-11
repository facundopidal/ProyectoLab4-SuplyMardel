import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ProductsAdminComponent } from '../products/products.component';
import { Product } from '../../../interfaces/product.js';
import { ApiProductsService } from '../../../services/ecommerce/api-products.service';

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

  showModal = false;
  productIdToDelete: string | null = null;

  openConfirmationModal(productId: string): void {
    this.productIdToDelete = productId;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (this.productIdToDelete !== null) {
      this.deleteProduct(this.productIdToDelete);
      this.productIdToDelete = null;
    }
    this.showModal = false;
  }

  cancelDelete(): void {
    this.productIdToDelete = null;
    this.showModal = false;
  }

  deleteProduct(productId: string): void {
    this.productsService.deleteProduct(productId).subscribe()
    this.products = this.products.filter(product => product.id !== productId);
  }

  
}
