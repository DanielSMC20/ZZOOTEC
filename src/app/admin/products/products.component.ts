import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  TableComponent,
  TableColumn,
} from '../../shared/components/table/table.component';
import { TableHeaderComponent } from '../../shared/components/table-header/table-header.component';

import { ProductService } from '../../core/service/products.service';
import { Product } from '../../models/products.models';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [TableComponent, TableHeaderComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  allProducts: any[] = []; // Copia completa de productos

  columns: TableColumn[] = [
    { key: 'imageUrl', label: 'Imagen', type: 'image' },
    { key: 'name', label: 'Producto' },
    { key: 'categoryName', label: 'Categoría' },
    { key: 'price', label: 'Precio' },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Estado', type: 'badge' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  constructor(
    private productsService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((data) => {
      const mappedData = data.map((p) => ({
        ...p,
        status: p.active ? 'Activo' : 'Inactivo',
        categoryName: p.category?.name ?? '—',
        imageUrl: this.formatImageUrl(p.imageUrl),
      }));
      this.allProducts = mappedData;
      this.products = mappedData;
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

    // Si ya es URL de Cloudinary
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // Si es ruta relativa, agregar prefijo
    return `${environment.apiUrl}/uploads/${imageUrl}`;
  }

  onEditProduct(product: Product) {
    this.router.navigate(['/admin/products', product.id, 'edit']);
  }

  onView(product: Product) {
    this.router.navigate(['/admin/products', product.id]);
  }

  onAddProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  onSearchProduct(value: string) {
    const searchTerm = value.toLowerCase().trim();

    if (!searchTerm) {
      this.products = this.allProducts;
      return;
    }

    this.products = this.allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.categoryName?.toLowerCase().includes(searchTerm),
    );
  }
}
