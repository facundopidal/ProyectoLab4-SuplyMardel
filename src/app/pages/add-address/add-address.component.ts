import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AddressesService } from '../../services/clients/adresses.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent{
  route  = inject(Router);
  fb = inject(FormBuilder);
  addressesService = inject(AddressesService);
  private router = inject(Router)
  private authService = inject(AuthService)
  
  formulario = this.fb.nonNullable.group({
    street: ['',[Validators.required, Validators.minLength(3)]],
    number: [null,[Validators.required, Validators.min(1)]],
    postalCode: [null,[Validators.required],Validators.min(1)],
    city: ['',[Validators.required, Validators.minLength(3)]],
    floor: [null],
    apartment: ['',],
  })


  addAddress() {
    if(this.formulario.invalid) return

    const {street, number, postalCode, city, floor, apartment} = this.formulario.getRawValue()
    const idClient = this.authService.getUserId()
    this.router.navigate(['/my-account'])
    this.addressesService.addAddress(street, number!, postalCode!, city, floor!, apartment, idClient!).subscribe({
      next: (newAddress) => {
        console.log(newAddress)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  

}
