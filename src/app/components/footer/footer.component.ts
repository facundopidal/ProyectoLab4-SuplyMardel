import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
    items =[{nombre:"Inicio"},
        {nombre:"Productos"},
        {nombre:"Sobre Nosotros"},
        {nombre:"Contacto"}]
}
