import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../interfaces/product';
import { ApiProductsService } from '../../../services/ecommerce/api-products.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    MenuComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit{
  
  constructor ( private route: ActivatedRoute, private productsServ: ApiProductsService, private router: Router) { }
  fb = inject(FormBuilder)
  id: string | null = null
  urlImage?: string

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    if(!this.id) this.router.navigate(['/']);

    this.productsServ.getProductById(this.id!).subscribe({
      next: (product) => {
        console.log(product)
        const { id, ...productToEdit } = product
        this.formulario.setValue({...productToEdit})
        this.updateUrl()
      },
      error: console.error
    })
  }
  
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

  editarProducto() {
    if(this.formulario.invalid) return 

    this.productsServ.updateProduct(this.id!, this.formulario.getRawValue()).subscribe({
      next: (product) => {
        console.log(product)
        this.router.navigate(['/admin'])
        alert("Producto modificado correctamente")
      },
      error: (error) => {
        this.router.navigate(['/admin'])
        alert("Ocurrio un error")
        console.error(error)
      } 

    })
  }

}