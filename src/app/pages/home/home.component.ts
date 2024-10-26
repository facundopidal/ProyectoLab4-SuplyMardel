import { Component } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavBarComponent,
    InfoSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
