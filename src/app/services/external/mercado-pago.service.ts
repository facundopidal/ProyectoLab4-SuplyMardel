import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
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

  private baseUrl = "https://t9pnxqsk-3003.brs.devtunnels.ms/" // Reemplazar con tunel
  goToPay(products: Product[], shippingPrice: number, idAddress: string | null): Observable<PreferenceResponse> {
    console.log({products: products, shippingPrice: shippingPrice})
    return this.http.post<PreferenceResponse>(`${this.baseUrl}create_preference`,{products: products, shippingPrice: shippingPrice, idAddress: idAddress})
  }



  getOrderData(merchantOrderId: number): Observable<NonNullable<any>> {
    return this.http.get<NonNullable<any>>(`${this.baseUrl}merchant-order/${merchantOrderId}`)
  }
}
