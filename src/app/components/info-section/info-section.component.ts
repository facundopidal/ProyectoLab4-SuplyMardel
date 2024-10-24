import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-info-section',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './info-section.component.html',
    styleUrl: './info-section.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoSectionComponent { }
