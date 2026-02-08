import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../core/service/brand.service';
import { Brand } from '../../../models/brand.model';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './brand-form.component.html',
})
export class BrandFormComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'create';
  brandId?: number;

  form!: FormGroup;
  preview: string | null = null;
  selectedFile: File | null = null;
  brandImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
  ) {}

  ngOnInit(): void {
    this.initForm();

    combineLatest([this.route.paramMap, this.route.url]).subscribe(
      ([params]) => {
        const id = params.get('id');
        const url = this.route.snapshot.url.map((u) => u.path).join('/');

        if (url.includes('edit')) {
          this.mode = 'edit';
        } else if (id) {
          this.mode = 'view';
        } else {
          this.mode = 'create';
        }

        this.brandId = id ? Number(id) : undefined;

        if (this.mode === 'view') {
          this.form.disable();
        } else {
          this.form.enable();
        }

        if (this.brandId) {
          this.loadBrand(this.brandId);
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
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  loadBrand(id: number) {
    this.brandService.getById(id).subscribe((brand: Brand) => {
      this.form.patchValue({
        name: brand.name,
      });

      this.brandImage = brand.imageUrl
        ? `${environment.apiUrl}/uploads/${brand.imageUrl}`
        : null;

      this.preview = this.brandImage;
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
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.mode === 'view') {
      return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify({ name: this.form.value.name }));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.mode === 'create') {
      this.brandService.create(formData).subscribe(() => this.back());
    }

    if (this.mode === 'edit' && this.brandId) {
      this.brandService
        .update(this.brandId, formData)
        .subscribe(() => this.back());
    }
  }

  back() {
    this.router.navigate(['/admin/brands']);
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

    return '';
  }
}
