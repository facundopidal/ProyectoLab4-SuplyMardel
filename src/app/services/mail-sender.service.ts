import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailSenderService {

  constructor(private http: HttpClient) { }
  private adminMail = "juliteixido12@gmail.com"
  private baseUrl = "http://localhost:3000/"

  sendMailToAdmin(subject:string, text:string, client:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}send-email`, {to: this.adminMail, subject: subject, text: text, client: client})
  }

  sendMailToUser(to:string, subject:string, text:string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}send-email-touser`, {to: to, subject: subject, text: text})
  }
}
