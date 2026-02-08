import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Brand } from '../../models/brand.model';
import { BrandService } from '../../core/service/brand.service';
import { environment } from '../../../environments/environment';

import {
  TableComponent,
  TableColumn,
} from '../../shared/components/table/table.component';
import { TableHeaderComponent } from '../../shared/components/table-header/table-header.component';

@Component({
  standalone: true,
  imports: [TableComponent, TableHeaderComponent],
  templateUrl: './brand.component.html',
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  allBrands: Brand[] = []; // Copia completa de marcas

  columns: TableColumn[] = [
    { key: 'imageUrl', label: 'Imagen', type: 'image' },
    { key: 'name', label: 'Marca' },
    { key: 'status', label: 'Estado', type: 'badge' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  constructor(
    private brandService: BrandService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getAll().subscribe((data) => {
      const mappedData = data.map((b) => ({
        ...b,
        status: b.active ? 'Activo' : 'Inactivo',
        imageUrl: this.formatImageUrl(b.logoUrl),
      }));
      this.allBrands = mappedData;
      this.brands = mappedData;
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
    this.router.navigate(['/admin/brands/new']);
  }

  onView(brand: Brand) {
    this.router.navigate(['/admin/brands', brand.id]);
  }

  onEdit(brand: Brand) {
    this.router.navigate(['/admin/brands', brand.id, 'edit']);
  }

  onDelete(brand: Brand) {
    if (confirm(`¿Eliminar la marca ${brand.name}?`)) {
      this.brandService.delete(brand.id).subscribe(() => {
        this.loadBrands();
      });
    }
  }

  onSearch(value: string) {
    const searchTerm = value.toLowerCase().trim();

    if (!searchTerm) {
      this.brands = this.allBrands;
      return;
    }

    this.brands = this.allBrands.filter((b) =>
      b.name.toLowerCase().includes(searchTerm),
    );
  }
}
