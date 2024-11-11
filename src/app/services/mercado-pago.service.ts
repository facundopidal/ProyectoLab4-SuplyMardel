import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../interfaces/product";

interface PreferenceResponse {
  id: string;
  init_point: string;
}

@Injectable({
    providedIn: 'root'
})
export class MercadoPagoService{

  constructor(private http: HttpClient) { }

  private baseUrl = "http://localhost:3003/create_preference"
  goToPay(products: Product[]): Observable<PreferenceResponse> {
    console.log(products)
    return this.http.post<PreferenceResponse>(this.baseUrl, products)
  }
}
