import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/ecommerce/cart.service';
import { Product } from '../../interfaces/product';
import { ApiProductsService } from '../../services/ecommerce/api-products.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  clientId: any;
  newProductId: any;
  rawCartproducts!: { id: string, idProduct: string, quantity: number }[];
  products: Product[] = [];
  total : number = 0

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productsService: ApiProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = localStorage.getItem('userId');
    this.newProductId = this.route.snapshot.paramMap.get('id');
  
    // Paso 1: Obtener los productos en el carrito
    this.cartService.getCartProducts(this.clientId).pipe(
      switchMap((rawProducts) => {
        this.rawCartproducts = rawProducts;
  
        // Paso 2: Verificar si hay un nuevo producto para agregar
        if (this.newProductId) {
          return this.productsService.getProductById(this.newProductId).pipe(
            switchMap((product) => {
              // Si el producto no existe, simplemente retornar los productos actuales sin hacer nada
              if (!product) {
                this.router.navigate(['/cart'])
              }
  
              const existingProduct = this.rawCartproducts.find(
                (cartProduct) => cartProduct.idProduct === this.newProductId
              );

  
              // Si no existe en el carrito, agregarlo
              if (!existingProduct) {
                return this.cartService.addProductToCart(this.clientId, this.newProductId, 1).pipe(
                  switchMap((cartProduct) => {
                    // Agregar el nuevo producto al array después de guardarlo en el backend
                    this.rawCartproducts.push({ id: cartProduct.id, idProduct: this.newProductId, quantity: 1 });
                    return of(this.rawCartproducts); // Continuar con el siguiente paso
                  })
                );
              } else {
                // Si el producto ya está en el carrito, actualizar la cantidad
                existingProduct.quantity++;
                return this.cartService.updateQuantity(existingProduct.id, existingProduct.quantity).pipe(
                  switchMap(() => of(this.rawCartproducts))
                );
              }
            }),
            
            catchError ((error)=> {
              of(this.rawCartproducts)
              this.router.navigate(['/cart'])
              throw error
            })
          );
        } else {
          return of(this.rawCartproducts);
        }
      }),
      // Paso 3: Cargar detalles de los productos usando `forkJoin`
      switchMap(() => {
        const productObservables = this.rawCartproducts.map((rawProduct) =>
          this.productsService.getProductById(rawProduct.idProduct)
        );
        return forkJoin(productObservables);
      })
    ).subscribe({
      next: (productsArray) => {
        this.products = productsArray; // Asignar directamente a `products`
        this.updateTotal();
      },
      error: (error) => console.error(error),
    });
  }
  

  incrementQuantity(index: number, product: Product): void {
    const cartProduct = this.rawCartproducts[index];
    if (cartProduct.quantity < product.stock) {
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
    const newQuantity: number = Math.min(Math.max(1, parseInt(quantity)), product.stock);
    this.updateQuantityInService(cartProduct.id, newQuantity);
  }

  updateQuantityInService(id: string, quantity: number): void {
    this.cartService.updateQuantity(id, quantity).subscribe({
      next: () => {
        const cartProduct = this.rawCartproducts.find((p) => p.id === id);
        if (cartProduct) cartProduct.quantity = quantity;
        this.updateTotal()
      },
      error: console.error
    });
  }

  deleteProduct(index: number) {
    const id = this.rawCartproducts[index].id;
    this.rawCartproducts.splice(index, 1);
    this.products.splice(index, 1);
    this.cartService.deleteProductCart(id).subscribe({
      next: ()=> {
        this.updateTotal()
      },
      error: console.error
    });
  }

  updateTotal() {
    this.total = 0
    for (let i = 0; i < this.products.length; i++) {
      this.total += this.products[i].price * this.rawCartproducts[i].quantity
    }
  }

  goToCheckout(): void {
    const selectedProducts = this.rawCartproducts.map(product => ({
      idProduct: product.idProduct,
      quantity: product.quantity
    }));
  
    // Serializar a JSON y codificar en URI
    const productsParam = encodeURIComponent(JSON.stringify(selectedProducts));
  
    // Navegar a la página de compra con el parámetro de los productos
    this.router.navigate(['/checkout'], { queryParams: { products: productsParam } });
  }
}
