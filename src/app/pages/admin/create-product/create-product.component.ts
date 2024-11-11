import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../../interfaces/product';
import { ApiProductsService } from '../../../services/ecommerce/api-products.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MenuComponent
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {

  route  = inject(Router);
  fb = inject(FormBuilder);
  service = inject(ApiProductsService);
  urlImage?: string
  
  formulario = this.fb.nonNullable.group({
    name: ['',[Validators.required, Validators.minLength(5)]],
    brand: ['',[Validators.required, Validators.minLength(2)]],
    price: [1,[Validators.required, Validators.min(1)]],
    stock: [0,[Validators.required, Validators.min(0)]],
    image: ['',[Validators.required, Validators.minLength(5)]],
    description: ['',[Validators.required, Validators.minLength(10)]],
    category: ['',[Validators.required, Validators.minLength(3)]],
    flavor: ['',],
    weight: [0,[Validators.required, Validators.min(0)]],
  })

  updateUrl() {
    this.urlImage = this.formulario.get('image')?.value
  }
  

  agregarProducto(){
    if(this.formulario.invalid) return
    const producto = this.formulario.getRawValue() as Product;

    this.service.addProduct(producto).subscribe({
      next: (producto) => {
        alert('Producto agregado con exito');
        this.route.navigate(['admin']);
      },
      error: (e : Error) => {
        console.log(e.message);
      }
    })
  }

}
