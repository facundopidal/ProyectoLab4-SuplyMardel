import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        SearchBarComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    
})
export class HeaderComponent implements OnInit{ 
    isLogin : boolean = false
    isAdmin : boolean = false
    authService = inject(AuthService)

    ngOnInit(): void {
        this.authService.isLoggedIn$.subscribe((loggedIn) => {
            this.isLogin = loggedIn
        })
        this.authService.isAdmin$.subscribe((isAdmin) => {
            this.isAdmin = isAdmin
        })
    }
}
