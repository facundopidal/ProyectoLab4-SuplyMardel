import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product';
import { ApiProductsService } from '../../services/api-products.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  clientId: any;
  newProductId: any;
  rawCartproducts!: { id: any, idProduct: number, quantity: number }[];
  products: Product[] = [];

  constructor(
    private router: ActivatedRoute,
    private cartService: CartService,
    private productsService: ApiProductsService
  ) {}

  ngOnInit(): void {
    this.clientId = localStorage.getItem('userId');
    this.newProductId = this.router.snapshot.paramMap.get('id');

    // Primero, obtenemos los productos en el carrito
    this.cartService.getCartProducts(this.clientId).subscribe({
      next: (rawProducts) => {
        this.rawCartproducts = rawProducts;

        // Si hay un nuevo producto para agregar
        if (this.newProductId) {
          // Verificar si `newProductId` ya está en `rawCartproducts`
          const rawProduct: any = this.rawCartproducts.find(
            (product) => product.idProduct === parseInt(this.newProductId)
          );

          // Si no existe en el carrito, se agrega
          if (!rawProduct) {
            this.cartService.addProductToCart(parseInt(this.clientId), parseInt(this.newProductId), 1).subscribe({
              next: (cartProduct) => {
                // Agregar el nuevo producto a `rawCartproducts` después de agregarlo al backend
                this.rawCartproducts.push({id: cartProduct.id, idProduct: parseInt(this.newProductId), quantity: 1 });
              },
              error: (error) => {console.error(error)} 
            });
          }  else {
            rawProduct.quantity++
            this.cartService.updateQuantity(rawProduct.id, rawProduct.quantity).subscribe({
              error: console.error
            })
          }
        }

        // Genera observables para cada producto y aplanarlos al resultado final
        const productObservables = this.rawCartproducts.map((rawProduct) =>
          this.productsService.getProductById(rawProduct.idProduct)
        );

        // Usa `forkJoin` y asigna directamente a `products`
        forkJoin(productObservables).subscribe({
          next: (productsArray) => {
            this.products = productsArray.flat(); // Aplana el array
          },
          error: (error) => console.error(error)
        });
      },
      error: (error) => console.error(error)
    });
  }

  incrementQuantity(index: number, product: Product): void {
    const cartProduct = this.rawCartproducts[index];
    if(cartProduct.quantity < product.stock){
      this.updateQuantityInService(cartProduct.id, cartProduct.quantity + 1);
    }
  }

  decrementQuantity(index: number): void {
    const cartProduct = this.rawCartproducts[index];
    if (cartProduct.quantity > 1) {
      this.updateQuantityInService(cartProduct.id, cartProduct.quantity - 1);
    }
  }

  updateQuantity(index: number, quantity: string, product: Product): void {
    const cartProduct = this.rawCartproducts[index];
    const newQuantity = Math.min(Math.max(1, parseInt(quantity)), product.stock); // No permite que la cantidad sea menor a 1 o mayor al stock
    this.updateQuantityInService(cartProduct.id, newQuantity);
  }

  updateQuantityInService(id: any, quantity: number): void {
    this.cartService.updateQuantity(id, quantity).subscribe({
      next: () => {
        const cartProduct = this.rawCartproducts.find((p) => p.id === id);
        if (cartProduct) cartProduct.quantity = quantity;
      },
      error: console.error
    });
  }

  deleteProduct(index: number) {
    const id = this.rawCartproducts[index].id
    this.cartService.deleteProductCart(id).subscribe()
  }
}
