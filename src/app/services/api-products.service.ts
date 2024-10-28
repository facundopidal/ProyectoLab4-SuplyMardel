import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ApiProductsService {

  http = inject(HttpClient)
  private urlBase = "https://lcvt5tbh-8000.brs.devtunnels.ms/products"
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.urlBase)
  }
  postProducts(product: Product): Observable<Product[]>{
    return this.http.post<Product[]>(this.urlBase, product)
  }

  getProductByBrand(brand: String): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.urlBase}?brand=${brand}`)
  }
}
