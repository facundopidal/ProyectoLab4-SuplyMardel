import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AddressesService } from '../../services/clients/adresses.service';
import { Address } from '../../interfaces/address';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent {

  route  = inject(Router);
  fb = inject(FormBuilder);
  addressesService = inject(AddressesService);
  private router = inject(Router)
  private authService = inject(AuthService)
  @Output() onAdd = new EventEmitter<Address>()

  
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
    this.addressesService.addAddress(street, number!, postalCode!, city, floor!, apartment, idClient!).subscribe({
      next: (newAddress) => {
        console.log(newAddress)
        this.onAdd.emit(newAddress)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
