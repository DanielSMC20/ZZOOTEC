import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/service/user.service';
import { ImageService } from '../../../core/service/image.service';
import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  mode: 'create' | 'edit' | 'view' = 'create';
  userId?: number;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  currentImage: string | null = null;

  roles = ['ADMIN'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private router: Router,
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

        this.userId = id ? Number(id) : undefined;

        if (this.mode === 'view') {
          this.form.disable();
        } else {
          this.form.enable();
        }

        if (this.userId) {
          this.loadUser(this.userId);
        }
      },
    );
  }

  initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      password: [''],
      fechaNacimiento: [''],
      imageUrl: [''],
      roles: ['ADMIN', Validators.required],
      activo: [true],
    });
  }

  loadUser(id: number) {
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          email: user.email,
          telefono: user.telefono,
          fechaNacimiento: user.fechaNacimiento,
          imageUrl: user.imageUrl,
          roles: user.roles?.[0] ?? 'ADMIN',
          activo: user.activo,
        });
        this.currentImage = user.imageUrl;
      },
      error: () => {
        this.back();
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPG, PNG, WEBP)');
      event.target.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('La imagen no debe superar 5MB');
      event.target.value = '';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
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

    const uploadImage$ = this.selectedFile
      ? this.imageService.upload(this.selectedFile)
      : of(this.form.value.imageUrl);

    uploadImage$
      .pipe(
        switchMap((imageUrl) => {
          const payload = {
            email: this.form.value.email,
            telefono: this.form.value.telefono,
            fechaNacimiento: this.form.value.fechaNacimiento,
            imageUrl: imageUrl || undefined,
            roles: [this.form.value.roles],
            activo: this.form.value.activo,
          };

          if (this.mode === 'create') {
            return this.userService.create(payload);
          } else {
            return this.userService.update(this.userId!, payload);
          }
        }),
      )
      .subscribe({
        next: () => this.back(),
        error: (err) => {
          console.error('Error al guardar usuario', err);
          alert('Error al guardar el usuario');
        },
      });
  }

  back() {
    this.router.navigate(['/admin/users']);
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
    if (field?.hasError('email')) {
      return 'Ingrese un correo válido';
    }
    if (field?.hasError('pattern')) {
      return 'El teléfono debe tener entre 7 y 15 dígitos';
    }

    return '';
  }
}
