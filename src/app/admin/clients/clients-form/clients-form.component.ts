import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-clients-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients-form.component.html',
})
export class ClientsFormComponent implements OnInit {
  form!: FormGroup;
  mode: 'create' | 'edit' | 'view' = 'create';
  clientId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
  ) {}

  ngOnInit(): void {
    console.log('URL ACTUAL:', this.router.url);

    this.initForm();

    const url = this.router.url;

    if (url.includes('/new')) {
      this.mode = 'create';
    } else if (url.includes('/edit')) {
      this.mode = 'edit';
    } else {
      this.mode = 'view';
    }

    console.log('MODE REAL:', this.mode);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = Number(id);
      this.loadClient(this.clientId);
    }

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombres: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{9}$/), // 9 dígitos
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      canalOrigen: ['WEB', Validators.required],
    });
  }

  loadClient(id: number): void {
    this.clientsService.getClientById(id).subscribe((res) => {
      console.log('🟢 Cliente recibido:', res);

      this.form.patchValue({
        nombres: res.nombres,
        apellidos: res.apellidos,
        telefono: res.telefono,
        correo: res.correo,
        canalOrigen: res.canalOrigen,
      });

      // si luego quieres mostrar imagen
      // this.clientImage = res.imageUrl
      //   ? `${environment.apiUrl}/uploads/${res.imageUrl}`
      //   : null;
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.getRawValue();

    if (this.mode === 'create') {
      this.clientsService
        .createClient(this.buildFormData(data))
        .subscribe(() => this.router.navigate(['/admin/clients']));
    }

    if (this.mode === 'edit' && this.clientId) {
      this.clientsService
        .updateClient(this.clientId, this.buildFormData(data))
        .subscribe(() => this.router.navigate(['/admin/clients']));
    }
  }

  private buildFormData(data: any): FormData {
    const fd = new FormData();

    fd.append('nombres', data.nombres);
    fd.append('apellidos', data.apellidos);
    fd.append('telefono', data.telefono);
    fd.append('correo', data.correo);
    fd.append('canalOrigen', data.canalOrigen);

    return fd;
  }

  cancel(): void {
    this.router.navigate(['/admin/clients']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
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
    if (field?.hasError('email')) {
      return 'Ingrese un correo válido';
    }
    if (field?.hasError('pattern') && fieldName === 'telefono') {
      return 'Debe ser un teléfono de 9 dígitos';
    }

    return '';
  }
}
