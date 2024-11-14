import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { SaleComponent } from '../../components/sale/sale.component';
import { Sale } from '../../interfaces/sale';
import { SalesService } from '../../services/ecommerce/sales.service';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [NavBarComponent, SaleComponent],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})
export class PurchasesComponent{

  

}
