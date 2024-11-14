import { Injectable } from '@angular/core';
import { Sale } from '../../interfaces/sale';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {


  constructor(private cartService: CartService, private http: HttpClient) { }
  private baseUrl = ""
  
    createSale(idClient: string, date: string, paymentStatus: "approved" | "rejected", shipmentMethod: string, totalAmount: number, shippingAdress?: string): Observable<Sale>{
      let productsXSale;
      let shipmentStatus: string;
      this.cartService.getCartProducts(idClient).subscribe({
        next: (cartProducts) => {
          productsXSale = cartProducts
          if(paymentStatus === 'approved'){
            shipmentStatus = shipmentMethod === "Retiro en sucursal" ? "A retirar" : "En camino"
            
            this.cartService.deleteCartByIdClient(idClient).subscribe({
              error: console.error
            })
          }
          else {
             shipmentStatus = "Cancelado"
          }
          
          return this.http.post<Sale>(this.baseUrl, 
            {id_client: idClient, date: date, amount: totalAmount, shipmentStatus: shipmentStatus, shipmentMethod: shipmentMethod,
               shippingAdress: shippingAdress, paymentStatus: paymentStatus, isCancelled: paymentStatus !== 'approved'})
        },
        error: console.error
      })
      throw new Error("Ocurrio un error inesperado")
    }

    /*id:string;
    id_client:string;
    date:Date;
    amount:number;
    shipmentStatus: string;
    shipmentMethod: string;
    shippingAdress: string; //id del domicilio
    paymentStatus: string;
    paymentMethod: string;
    isCancelled: boolean;*/

    

    

}
