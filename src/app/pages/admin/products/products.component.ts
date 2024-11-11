import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../interfaces/product'
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsAdminComponent {
  @Input() producto!: Product;
  @Output() deleteProduct = new EventEmitter<string>();


  onDelete() {
    this.deleteProduct.emit(this.producto.id);
  }
}
