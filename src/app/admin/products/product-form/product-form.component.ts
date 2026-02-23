import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../../core/service/products.service';
import { CategoryService } from '../../../core/service/category.service';
import { BrandService } from '../../../core/service/brand.service';
import { Product } from '../../../models/products.models';
import { combineLatest } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'create';
  productId?: number;

  form!: FormGroup;

  categories: any[] = [];
  brands: any[] = [];

  selectedCategoryImage: string | null = null;
  selectedBrandImage: string | null = null;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  productImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadBrands();

    combineLatest([
      this.route.data,
      this.route.paramMap,
      this.route.url,
    ]).subscribe(([data, params]) => {
      const id = params.get('id');
      const url = this.route.snapshot.url.map((u) => u.path).join('/');

      // 🔥 detectar modo por URL REAL
      if (url.includes('edit')) {
        this.mode = 'edit';
      } else if (id) {
        this.mode = 'view';
      } else {
        this.mode = 'create';
      }

      this.productId = id ? Number(id) : undefined;

      // estado formulario
      if (this.mode === 'view') {
        this.form.disable();
      } else {
        this.form.enable();
      }

      if (this.productId) {
        this.loadProduct(this.productId);
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      categoryId: ['', Validators.required],
      brandId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^[0-9]+$/), // Solo números enteros
        ],
      ],
      status: ['Activo'],
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res.map((c) => ({
        ...c,
        imageUrl: this.formatImageUrl(c.imageUrl),
      }));
    });
  }

  loadBrands() {
    this.brandService.getAll().subscribe((res) => {
      this.brands = res.map((b) => ({
        ...b,
        imageUrl: this.formatImageUrl(b.imageUrl),
      }));
    });
  }

  /**
   * Función helper para formatear URLs de imagen
   * Si ya es URL de Cloudinary, devolverla tal cual
   * Si es ruta relativa, agregarle el prefijo
   */
  formatImageUrl(imageUrl: string | null | undefined): string | null {
    if (!imageUrl) {
      return null;
    }

    // Si ya es URL de Cloudinary
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // Si es ruta relativa, agregar prefijo
    return `${environment.apiUrl}/uploads/${imageUrl}`;
  }

  loadProduct(id: number) {
    this.productService.getById(id).subscribe((res: Product) => {
      this.form.patchValue({
        name: res.name,
        description: res.description || '',
        categoryId: res.category?.id,
        brandId: res.brand?.id,
        price: res.price,
        stock: res.stock,
        status: res.active ? 'Activo' : 'Inactivo',
      });

      this.selectedCategoryImage = this.formatImageUrl(res.category?.imageUrl);
      this.selectedBrandImage = this.formatImageUrl(res.brand?.imageUrl);

      // 🔥 IMAGEN DEL PRODUCTO
      this.productImage = this.formatImageUrl(res.imageUrl);
    });
  }

  onCategoryChange() {
    const cat = this.categories.find((c) => c.id == this.form.value.categoryId);
    this.selectedCategoryImage = cat?.imageUrl ?? null;
  }

  onBrandChange() {
    const brand = this.brands.find((b) => b.id == this.form.value.brandId);
    this.selectedBrandImage = brand?.imageUrl ?? null;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPG, PNG, WEBP)');
      event.target.value = '';
      return;
    }

    // Validar tamaño (máximo 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('La imagen no debe superar 2MB');
      event.target.value = '';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result);
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append(
      'data',
      JSON.stringify({
        name: this.form.value.name,
        description: this.form.value.description,
        categoryId: Number(this.form.value.categoryId),
        brandId: Number(this.form.value.brandId),
        price: Number(this.form.value.price),
        stock: Number(this.form.value.stock),
      }),
    );

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.mode === 'create') {
      this.productService
        .create(formData)
        .subscribe(() => this.router.navigate(['/admin/products']));
    }

    if (this.mode === 'edit' && this.productId) {
      this.productService
        .update(this.productId, formData)
        .subscribe(() => this.router.navigate(['/admin/products']));
    }
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }

  // Métodos helper para validaciones
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      const minValue = field.errors?.['min'].min;
      return `El valor mínimo es ${minValue}`;
    }
    if (field?.hasError('pattern') && fieldName === 'stock') {
      return 'Debe ser un número entero';
    }

    return '';
  }
}
