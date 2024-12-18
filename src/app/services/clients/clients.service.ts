import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, last, map, Observable, of } from "rxjs";
import { Client } from "../../interfaces/client";


@Injectable({
    providedIn: 'root'
})

export class ClientsService {
    private http = inject(HttpClient)

    baseUrl = "http://localhost:8000/clients"

    getClientById(id: string): Observable<Client> {
        return this.http.get<Client>(`${this.baseUrl}/${id}`)
    }

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.baseUrl)
    }

    getClientByEmail(email: string): Observable<Client> {
        return this.http.get<Client[]>(`${this.baseUrl}?email=${email}`).pipe(
            map((clientArray) => {
                return clientArray[0]
            })
        )
    }

    updateClientByID(id: string, client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.baseUrl}/${id}`, client)
    }  

    registerClient(client : { name: string, lastname: string, email: string, password: string }): Observable<boolean> {
        
        return this.http.post<Client>(this.baseUrl, client).pipe(
            map((client) => {
                console.log(client)
                return client ? true : false
            }),
            catchError( () => of(true))
        )
    }

    clientExists(email: string): Observable<boolean> {
        return this.http.get<Client[]>(`${this.baseUrl}?email=${email}`).pipe(
            map((clients) => {
                if(clients.length > 0)
                    return true
                return false
            }),
        )
    }
}