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
import { combineLatest } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  mode: 'create' | 'edit' | 'view' = 'create';
  userId?: number;

  roles = ['ADMIN']; // por ahora solo ADMIN

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
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
          roles: user.roles?.[0] ?? 'ADMIN',
          activo: user.activo,
        });
      },
      error: () => {
        this.back();
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.mode === 'view') {
      return;
    }

    const payload = {
      email: this.form.value.email,
      telefono: this.form.value.telefono,
      fechaNacimiento: this.form.value.fechaNacimiento,
      roles: [this.form.value.roles],
      activo: this.form.value.activo,
    };

    if (this.mode === 'create') {
      this.userService.create(payload).subscribe(() => this.back());
    }

    if (this.mode === 'edit') {
      this.userService
        .update(this.userId!, payload)
        .subscribe(() => this.back());
    }
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
