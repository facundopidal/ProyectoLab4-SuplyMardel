import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ApiProductsService {


  http = inject(HttpClient)
  private urlBase = "http://localhost:8000/products"
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.urlBase)
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.urlBase}/${id}`)
  }

  getProductsByBrand(brand: String): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.urlBase}?brand=${brand}`)
  }

  addProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(this.urlBase, product)
  }

  updateProduct(id:string, productParams: object): Observable<Product> {
    return this.http.patch<Product>(`${this.urlBase}/${id}`, productParams)
  }

  deleteProduct(id:string): Observable<Product> {
    return this.http.delete<Product>(`${this.urlBase}/${id}`)
  }


}
