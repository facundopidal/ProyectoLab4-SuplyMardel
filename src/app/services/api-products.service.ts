import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ApiProductsService {


  http = inject(HttpClient)
  private urlBase = "https://8v3chgzr-8000.brs.devtunnels.ms/products"
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.urlBase)
  }

  getProductByBrand(brand: String): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.urlBase}?brand=${brand}`)
  }

  postProducts(product: Product): Observable<Product[]>{
    return this.http.post<Product[]>(this.urlBase, product)
  }

  updateProduct(id:number, productParams: object): Observable<Product> {
    return this.http.patch<Product>(`${this.urlBase}/${id}`, productParams)
  }

  deleteProduct(id:number): Observable<Product> {
    return this.http.delete<Product>(`${this.urlBase}/${id}`)
  }
}
