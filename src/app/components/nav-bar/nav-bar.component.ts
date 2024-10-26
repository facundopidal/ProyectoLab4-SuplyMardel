import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  categories = [
    {id: 1, nombre: 'Proteinas'}, 
    {id: 2, nombre: 'Creatinas'},
    {id: 3, nombre: 'Aminoácidos'}, 
    {id: 4, nombre: 'Preentreno'}] 

  brands = [
    {id: 1, nombre: 'ENA'}, 
    {id: 2, nombre: 'Star Nutrition'},
    {id: 3, nombre: 'Xtrenght'}, 
    {id: 4, nombre: 'Body Advance'},
    {id: 5, nombre: 'Nutrilab'}
  ]
}
