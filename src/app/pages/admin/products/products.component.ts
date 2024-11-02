import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../interfaces/product'


@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsAdminComponent {
  @Input() producto!: Product;
  @Output() editProduct = new EventEmitter<string>();
  @Output() deleteProduct = new EventEmitter<string>();

  onEdit() {
    this.editProduct.emit(this.producto.id);
  }

  onDelete() {
    this.deleteProduct.emit(this.producto.id);
  }
}
