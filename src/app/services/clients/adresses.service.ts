import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../../interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  constructor(private http: HttpClient) { }

  private baseUrl = "http://localhost:8000/addresses"

  addAddress(street: string,number: number, postalCode: number,city: string, floor: number, apartment: string, idClient: string): Observable<Address> {
    return this.http.post<Address>(this.baseUrl, { street, number, postalCode, city, floor, apartment, idClient })
  }

  getAddressesByClient(idClient: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/?idClient=${idClient}`)
  }

  deleteAddressByID(idAddress: string): Observable<Address> {
    return this.http.delete<Address>(`${this.baseUrl}/${idAddress}`)
  }

  editAddress(idAddress: string, editParams: object): Observable<Address> {
    return this.http.patch<Address>(`${this.baseUrl}/${idAddress}`, editParams)
  }

  getAddressById(idAddress: string): Observable<Address> {
    return this.http.get<Address>(`${this.baseUrl}/${idAddress}`)
  }

}
