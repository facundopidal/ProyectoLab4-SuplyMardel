import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{
  @Output() categoriesEmitter = new EventEmitter<{id: number, name: string}[]>();
  @Output() brandsEmitter = new EventEmitter<{id: number, name: string}[]>();
  categories = [
    {id: 1, name: 'Proteinas'}, 
    {id: 2, name: 'Creatinas'},
    {id: 3, name: 'Aminoácidos'}, 
    {id: 4, name: 'Preentreno'}
  ] 
  brands = [
    {id: 1, name: 'ENA'}, 
    {id: 2, name: 'Star Nutrition'},
    {id: 3, name: 'Xtrenght'}, 
    {id: 4, name: 'Body Advance'},
    {id: 5, name: 'Nutrilab'}
  ]

  menuVisible = false; // Variable para controlar la visibilidad del menú

  ngOnInit(): void {
    this.categoriesEmitter.emit(this.categories);
    this.brandsEmitter.emit(this.brands);
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible; // Alternar la visibilidad del menú
  }
}
