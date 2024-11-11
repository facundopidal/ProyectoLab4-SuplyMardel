import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  authService = inject(AuthService)

  logout() {
    this.authService.logout()
  }
}
