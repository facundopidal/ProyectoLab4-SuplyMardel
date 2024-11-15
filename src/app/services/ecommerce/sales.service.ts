import { Injectable } from '@angular/core';
import { Sale } from '../../interfaces/sale';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { salesxProducts } from '../../interfaces/salesxProducts';
import { ApiProductsService } from './api-products.service';


@Injectable({
  providedIn: 'root'
})
export class SalesService {


  constructor(private cartService: CartService, private http: HttpClient, private productsService: ApiProductsService) { }
  private baseUrl = "http://localhost:8000/sales"
  private baserUrlSxP = "http://localhost:8000/salesxProducts"


  createSale(
    idClient: string,
    date: string,
    paymentStatus: "approved" | "rejected",
    shipmentMethod: string,
    totalAmount: number,
    id_merchant_order: string,
    shippingAdress?: string
  ): Observable<Sale> {
    let shipmentStatus: string;
    let isCancelled = paymentStatus !== 'approved';
  
    // Establecer el estado del envío según el método y estado de pago
    if (paymentStatus === 'approved') {
      shipmentStatus = shipmentMethod === "Retiro en sucursal" ? "A retirar" : "En camino";
    } else {
      shipmentStatus = "Cancelado";
    }
    
    // Obtener productos del carrito, luego crear la venta, registrar salesxProducts y limpiar carrito
    return this.cartService.getCartProducts(idClient).pipe(
      switchMap(cartProducts => {
        // Preparar los datos de la venta
        const saleData = {
          id_client: idClient,
          date: date,
          amount: totalAmount,
          shipmentStatus: shipmentStatus,
          shipmentMethod: shipmentMethod,
          shippingAdress: shippingAdress,
          paymentStatus: paymentStatus,
          isCancelled: isCancelled,
          id_merchant_order: id_merchant_order
        };
        // Crear la venta en la base de datos
        return this.http.post<Sale>(this.baseUrl, saleData).pipe(
          switchMap(sale => {
            // Crear registros de salesxProducts para cada producto en el carrito
            const salesxProductsData = cartProducts.map(product => ({
              idSale: sale.id,
              idProduct: product.idProduct,
              quantity: product.quantity
            }));
  
            this.decrementStock(salesxProductsData)
            // Hacer las peticiones de creación de salesxProducts en paralelo
            const createSalesxProductsRequests = salesxProductsData.map(salesxProductData =>
              this.http.post(this.baserUrlSxP, salesxProductData)
            );

            return forkJoin(createSalesxProductsRequests).pipe(
              // Después de crear todos los registros de salesxProducts, limpiar el carrito si la venta fue aprobada
              switchMap(() => {
                if (paymentStatus === 'approved') {
                  return this.cartService.deleteCartByIdClient(idClient).pipe(
                    map(() => { 
                      return sale
                    }) // Emitir la venta como resultado final
                  );
                } else {
                  // Si el pago fue rechazado, simplemente devolvemos la venta sin limpiar el carrito
                  return of(sale);
                }
              })
            );
          })
        );
      }),
      // Manejo de errores en todo el flujo observable
      catchError(error => {
        console.error("Error al crear la venta:", error);
        throw error; // Propagar el error para manejo posterior
      })
    );
  }

  decrementStock(sxpData: salesxProducts[]) {
    sxpData.forEach((sxp)=> {
      this.productsService.getProductById(sxp.idProduct).subscribe({
        next: (product) => {
          this.productsService.updateProduct(product.id!, {stock: product.stock -= sxp.quantity}).subscribe({
            next: (product) => {
              console.log(product)
            },
            error: console.log
          })
        }
      })
    })
  }

  cancelSale(idSale: string) {
    this.getSaleBySaleId(idSale).subscribe({
      next: (sale) => {
        sale.isCancelled = true
        this.http.put<Sale>(`${this.baseUrl}/${sale.id}`, sale).subscribe({
          next: (sale) => {
            this.incrementStock(sale.id)
          },
          error: console.error
        })
      }
    })
  }

  incrementStock(idSale: string) {
    this.getProductsBySalesID(idSale).subscribe({
      next: (sxpArray) => {
        sxpArray.forEach(sxp => {
          this.productsService.getProductById(sxp.idProduct).subscribe({
            next: (product) => {
              this.productsService.updateProduct(product.id!, {stock: product.stock + sxp.quantity}).subscribe({
                next: (newProduct) => {
                  console.log(newProduct)
                }
              })
            },
            error: console.error
          })
        })
      }
    })
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.baseUrl)
  }


  getSalesByClientId(idClient: string) {
    return this.http.get<Sale[]>(`${this.baseUrl}?id_client=${idClient}`)
  }

  getProductsBySalesID(idSale: string): Observable<salesxProducts[]> {
    return this.http.get<salesxProducts[]>(`${this.baserUrlSxP}?idSale=${idSale}`)
  }

  getSaleBySaleId(idSale: string): Observable<Sale>{
    return this.http.get<Sale>(`${this.baseUrl}/${idSale}`)
  }

  
  
}
