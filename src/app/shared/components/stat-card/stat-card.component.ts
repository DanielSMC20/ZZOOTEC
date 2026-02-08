import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() subtitle?: string;
  @Input() icon?: string;

}