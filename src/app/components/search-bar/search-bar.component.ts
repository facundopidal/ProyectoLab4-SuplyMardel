import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit {
    title = 'Comidas Geniales';
    searchTerm$ = new Subject<string>();
    private listDeliciousDishes = [
        'Ceviche',
        'Arepa',
        'Empanadas',
        'Asado',
        'Pizzas',
        'Hamburguesas',
        'Pollo a la Brasa',
        'Pasta 4 Quesos',
        'Lomo Saltado',
        'Pastel',
        'Arroz Chaufa',
    ];
    listFiltered: any = [];

    ngOnInit(): void {
        this.listFiltered = this.listDeliciousDishes;
        this.filterList();
    }

    filterList(): void {
        this.searchTerm$
            .pipe(
                debounceTime(400),
                distinctUntilChanged()
            )
            .subscribe(term => {
                this.listFiltered = this.listDeliciousDishes
                    .filter(item => item.toLowerCase().indexOf(term.toLowerCase()) >= 0);
            });
    }
}