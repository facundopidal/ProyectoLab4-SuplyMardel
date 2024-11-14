import { Component, Input } from '@angular/core';
import { Sale } from '../../interfaces/sale';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {

  @Input() sale!: Sale
}
