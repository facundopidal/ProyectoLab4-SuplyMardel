import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AddressesService } from '../../services/clients/adresses.service';
import { AuthService } from '../../services/auth/auth.service';
import { AddressFormComponent } from "../../components/address-form/address-form.component";

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [AddressFormComponent],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent{
  router = inject(Router)
  redirect(){
    this.router.navigate(['/my-account'])
  }
}
