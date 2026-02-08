import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

import { CategoryService } from '../../../core/service/category.service';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  mode: 'new' | 'edit' | 'view' = 'new';
  categoryId?: number;

  form!: FormGroup;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  categoryImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();

    combineLatest([this.route.paramMap, this.route.url]).subscribe(
      ([params]) => {
        const id = params.get('id');
        const url = this.route.snapshot.url.map((u) => u.path).join('/');

        // 🔥 MISMA LÓGICA QUE PRODUCTOS
        if (url.includes('edit')) {
          this.mode = 'edit';
        } else if (id) {
          this.mode = 'view';
        } else {
          this.mode = 'new';
        }

        console.log('CATEGORY MODE:', this.mode);

        this.categoryId = id ? Number(id) : undefined;

        // estado formulario
        if (this.mode === 'view') {
          this.form.disable();
        } else {
          this.form.enable();
        }

        if (this.categoryId) {
          this.loadCategory(this.categoryId);
        }
      },
    );
  }

  initForm() {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      status: ['Activo'],
    });
  }

  loadCategory(id: number) {
    this.categoryService.getById(id).subscribe((res) => {
      this.form.patchValue({
        name: res.name,
        status: res.active ? 'Activo' : 'Inactivo',
      });

      this.categoryImage = res.imageUrl
        ? `${environment.apiUrl}/uploads/${res.imageUrl}`
        : null;
    });
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
        active: this.form.value.status === 'Activo',
      }),
    );

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.mode === 'new') {
      this.categoryService
        .create(formData)
        .subscribe(() => this.router.navigate(['/admin/categories']));
    }

    if (this.mode === 'edit' && this.categoryId) {
      this.categoryService
        .update(this.categoryId, formData)
        .subscribe(() => this.router.navigate(['/admin/categories']));
    }
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }

  // Método helper para mostrar errores
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
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
