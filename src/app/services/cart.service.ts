import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    baseUrl = "http://localhost:8000/cartxproduct"

    constructor(private http: HttpClient) {}

    getCartProducts(cartId: number): Observable<{id: any, idProduct: number, quantity: number}[]> {
        return this.http.get<{id: any, idProduct: number, quantity: number}[]>(`${this.baseUrl}?idCart=${cartId}`)
    }

    addProductToCart(idCart: number, idProduct: number, quantity: number): Observable<{id: number, idCart: number, idProduct: number, quantity: number}> {
        return this.http.post<{id: number, idCart: number, idProduct: number, quantity: number}>(`${this.baseUrl}/`, {idCart, idProduct, quantity})
    }

    updateQuantity(id: any, quantity: number): Observable<{id: any, idCart: number, idProduct: number, quantity: number}> {
        return this.http.patch<{id: any, idCart: number, idProduct: number, quantity: number}>(`${this.baseUrl}/${id}`, {quantity: quantity})
    }

    deleteProductCart(id: any): Observable<{id: any, idCart: number, idProduct: number, quantity: number}>{
        return this.http.delete<{id: any, idCart: number, idProduct: number, quantity: number}>(`${this.baseUrl}/${id}`)
    }
}