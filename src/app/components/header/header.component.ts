import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        SearchBarComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent { }
