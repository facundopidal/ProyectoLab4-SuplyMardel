import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    baseUrl = "http://localhost:8000/cartxproduct"

    constructor(private http: HttpClient) {}

    getCartProducts(idClient: string): Observable<{id: string, idProduct: string, quantity: number}[]> {
        return this.http.get<{id: string, idProduct: string, quantity: number}[]>(`${this.baseUrl}?idClient=${idClient}`)
    }

    addProductToCart(idClient: string, idProduct: string, quantity: number): Observable<{id: string, idClient: string, idProduct: string, quantity: number}> {
        return this.http.post<{id: string, idClient: string, idProduct: string, quantity: number}>(`${this.baseUrl}/`, {idClient, idProduct, quantity})
    }

    updateQuantity(id: string, quantity: number): Observable<{id: string, idClient: string, idProduct: string, quantity: number}> {
        return this.http.patch<{id: string, idClient: string, idProduct: string, quantity: number}>(`${this.baseUrl}/${id}`, {quantity: quantity})
    }

    deleteProductCart(id: string): Observable<{id: string, idClient: string, idProduct: string, quantity: number}>{
        return this.http.delete<{id: string, idClient: string, idProduct: string, quantity: number}>(`${this.baseUrl}/${id}`)
    }
}