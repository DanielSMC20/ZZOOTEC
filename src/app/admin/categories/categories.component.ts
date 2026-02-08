import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  TableComponent,
  TableColumn,
} from '../../shared/components/table/table.component';

import { TableHeaderComponent } from '../../shared/components/table-header/table-header.component';

import { CategoryService } from '../../core/service/category.service';
import { Category } from '../../models/category.model';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [TableComponent, TableHeaderComponent],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  allCategories: Category[] = []; // Copia completa de categorías

  columns: TableColumn[] = [
    { key: 'imageUrl', label: 'Imagen', type: 'image' },
    { key: 'name', label: 'Categoría' },
    { key: 'status', label: 'Estado', type: 'badge' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.categoryService.getAll().subscribe((data) => {
      const mappedData = data.map((b) => ({
        ...b,
        status: b.active ? 'Activo' : 'Inactivo',
        imageUrl: this.formatImageUrl(b.imageUrl),
      }));
      this.allCategories = mappedData;
      this.categories = mappedData;
    });
  }

  /**
   * Función helper para formatear URLs de imagen
   * Si ya es URL de Cloudinary, devolverla tal cual
   * Si es ruta relativa, agregarle el prefijo
   */
  formatImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return 'assets/no-image.png';
    }

    // Si ya es URL de Cloudinary o completa
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // Si es ruta relativa, agregar prefijo
    return `${environment.apiUrl}/uploads/${imageUrl}`;
  }

  onAdd() {
    this.router.navigate(['/admin/categories/new']);
  }

  onSearch(text: string) {
    const value = text.toLowerCase().trim();

    if (!value) {
      this.categories = this.allCategories;
      return;
    }

    this.categories = this.allCategories.filter((c) =>
      c.name.toLowerCase().includes(value),
    );
  }

  // ====================
  // TABLE EVENTS
  // ====================

  onEdit(row: Category) {
    this.router.navigate(['/admin/categories', row.id, 'edit']);
  }

  onView(row: Category) {
    this.router.navigate(['/admin/categories', row.id]);
  }

  onDelete(row: Category) {
    const confirmDelete = confirm(`¿Eliminar la categoría "${row.name}"?`);

    if (!confirmDelete) return;

    this.categoryService.delete(row.id).subscribe(() => {
      this.load();
    });
  }
}
