import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    baseUrl = "http://localhost:8000/"

    constructor(private http: HttpClient) {}

    getCartProducts(cartId: number): Observable<{idCxP: any, idProduct: number, quantity: number}[]> {
        return this.http.get<{idCxP: any, idProduct: number, quantity: number}[]>(`${this.baseUrl}cartxproduct?idCart=${cartId}`)
    }

    addProductToCart(idCart: number, idProduct: number, quantity: number): Observable<{id: number, idCart: number, idProduct: number, quantity: number}> {
        return this.http.post<{id: number, idCart: number, idProduct: number, quantity: number}>(`${this.baseUrl}cartxproduct/`, {idCart, idProduct, quantity})
    }

    updateQuantity(id: any, quantity: number): Observable<{id: any, idCart: number, idProduct: number, quantity: number}> {
        return this.http.patch<{id: any, idCart: number, idProduct: number, quantity: number}>(`${this.baseUrl}cartxproduct/${id}`, {quantity: quantity})
    }


    deleteProductCart(cartId:number,productId:number, quantity: number){
        return this.http.get<{idProduct: number, quantity: number}[]>(`${this.baseUrl}?idCart=${cartId}`)
    }
}