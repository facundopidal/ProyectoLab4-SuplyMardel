import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [AppComponent, 
    NavBarComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

}
