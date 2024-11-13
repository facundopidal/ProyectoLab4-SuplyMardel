import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule,CommonModule,FormsModule],
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.css'
})
export class SearchBarComponent{
    //searchQuery: string = '';

    constructor(private router: Router) {}
    fb= inject(FormBuilder)
    searchForm = this.fb.group({
        searchQuery: ['', Validators.required]
    })
  
    onSearch() {
        if(this.searchForm.invalid) return
        const query = this.searchForm.get('searchQuery')?.value
        console.log(" hola");
        
        this.router.navigate(['/s'], { queryParams: { query: query } });
      }
    }
  