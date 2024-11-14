import { Injectable } from '@angular/core';
import { Sale } from '../../interfaces/sale';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {


  constructor(private cartService: CartService, private http: HttpClient) { }
  private baseUrl = "http://localhost:8000/sales"

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

    // Primero obtenemos los productos del carrito y luego hacemos la creación de la venta y el borrado del carrito
    return this.cartService.getCartProducts(idClient).pipe(
      switchMap(cartProducts => {
        // Guardamos la venta una vez tenemos los productos del carrito
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

        return this.http.post<Sale>(this.baseUrl, saleData).pipe(
          switchMap(sale => {
            // Si el pago fue aprobado, eliminamos el carrito después de crear la venta
            if (paymentStatus === 'approved') {
              return this.cartService.deleteCartByIdClient(idClient).pipe(
                // Emitimos la venta como el resultado final
                switchMap(() => [sale])
              );
            } else {
              // Si el pago no fue aprobado, simplemente devolvemos la venta creada
              return [sale];
            }
          })
        );
      }),
      // Captura errores en el flujo observable si ocurren
      catchError(error => {
        console.error("Error al crear la venta:", error);
        throw error; // Rethrow para que el error sea manejado donde se subscribe a createSale
      })
    );
  }


  getSalesByClientId(idClient: string) {
    return this.http.get<Sale[]>(`${this.baseUrl}/${idClient}`)
  }




}
