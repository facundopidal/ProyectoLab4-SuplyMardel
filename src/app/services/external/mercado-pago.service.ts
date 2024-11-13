import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../../interfaces/product";

interface PreferenceResponse {
  id: string;
  init_point: string;
}

@Injectable({
    providedIn: 'root'
})
export class MercadoPagoService{

  constructor(private http: HttpClient) { }

  private baseUrl = "https://lcvt5tbh-3003.brs.devtunnels.ms/create_preference"
  goToPay(products: Product[]): Observable<PreferenceResponse> {
    console.log(products)
    return this.http.post<PreferenceResponse>(this.baseUrl, products)
  }
}
