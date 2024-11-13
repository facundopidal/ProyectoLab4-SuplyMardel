import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, forkJoin, map, Observable, switchMap } from "rxjs";

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

    deleteCartByIdClient(idClient: string): Observable<void> {
        return this.getCartProducts(idClient).pipe(
            switchMap((cart) => {
                const deleteObservables = cart.map(product => this.deleteProductCart(product.id));
                return forkJoin(deleteObservables);  // Espera a que todas las eliminaciones terminen
            }),
            map(() => {}),  // Mapear a un Observable<void> para que no devuelva datos innecesarios
            catchError((error) => {
                console.error("Error al eliminar los productos del carrito:", error);
                throw error;  // Propagar el error para manejo posterior
            })
        );
    }
}