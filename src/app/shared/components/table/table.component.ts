import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'actions' | 'image';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Input() showDelete = true;

  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  selectedRow: any = null;
  isModalOpen = false;

  openModal(row: any) {
    this.selectedRow = row;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRow = null;
  }

  handleView() {
    if (this.selectedRow) {
      this.onView.emit(this.selectedRow);
      this.closeModal();
    }
  }

  handleEdit() {
    if (this.selectedRow) {
      this.onEdit.emit(this.selectedRow);
      this.closeModal();
    }
  }

  handleDelete() {
    if (this.selectedRow) {
      this.onDelete.emit(this.selectedRow);
      this.closeModal();
    }
  }
}
