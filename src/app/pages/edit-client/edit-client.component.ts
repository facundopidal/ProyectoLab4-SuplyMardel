import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Client } from '../../interfaces/client';
import { ClientsService } from '../../services/clients/clients.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent implements OnInit {
  actualClient?: Client;

  auth = inject(AuthService)
  fb = inject(FormBuilder)
  router = inject(Router)
  clientService = inject(ClientsService)
  
  constructor(private route: ActivatedRoute){}
  

  ngOnInit(): void {
    const id = this.auth.getUserId()
    this.clientService.getClientById(id!).subscribe({
      next: (client) => {
        this.actualClient = client;
        this.formulario.setValue({name: this.actualClient.name, lastname: this.actualClient.lastname})
      },
      error: (e) => {
        console.error(e)
      }
    })
  }

  formulario = this.fb.nonNullable.group({
    name: ['',[Validators.required,Validators.minLength(3)]],
    lastname: ['',[Validators.required,Validators.minLength(3)]],
  })

  

  editarPerfil() {
    if(this.formulario.invalid) return 
    const id = this.auth.getUserId()
    const {name, lastname} = this.formulario.getRawValue()
    this.actualClient!.name = name
    this.actualClient!.lastname = lastname

    this.clientService.updateClientByID(id!, this.actualClient!).subscribe({
      next: (prof) => {
        this.router.navigate([''])
        alert("Perfil modificado correctamente")
      },
      error: (error) => {
        this.router.navigate([''])
        alert("Ocurrio un error")
        console.error(error)
      } 

    })

}
}
