import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './table-header.component.html',
})
export class TableHeaderComponent {

  @Input() title = '';
  @Input() addLabel = 'Añadir';

  @Output() onAdd = new EventEmitter<void>();
  @Output() onSearch = new EventEmitter<string>();
  @Input() showAdd = true;

  searchValue = '';

  emitSearch() {
    this.onSearch.emit(this.searchValue);
  }
    add() {
    this.onAdd.emit();
  }

  search() {
    this.onSearch.emit(this.searchValue);
  }

}
