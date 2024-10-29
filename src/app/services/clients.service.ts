import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

Injectable({
    providedIn: 'root'
})

interface Client {
    id: number;
    name: string;
    lastName: string;
    address: string;
    email: string
    password: string;
}

export class ClientsService {
    private http = inject(HttpClient)

    baseUrl = "https://8v3chgzr-8000.brs.devtunnels.ms/clients"

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.baseUrl)
    }

    postClients(client: Client): Observable<Client> {
        return this.http.post<Client>(this.baseUrl, client)
    }
}