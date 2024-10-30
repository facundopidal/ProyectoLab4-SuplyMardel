import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "../interfaces/client";


@Injectable({
    providedIn: 'root'
})

export class ClientsService {
    private http = inject(HttpClient)

    baseUrl = "https://lcvt5tbh-8000.brs.devtunnels.ms/clients"

    getClientById(id: number): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.baseUrl}/?id=${id}`)
    }

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.baseUrl)
    }

    postClients(client: Client): Observable<Client> {
        return this.http.post<Client>(this.baseUrl, client)
    }
}