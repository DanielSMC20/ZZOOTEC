import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  loading = false;
  error = '';
  success = '';
  private fb = inject(FormBuilder);


  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });


  recover() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    // 🔐 Simulación (luego backend)
    setTimeout(() => {
      this.loading = false;
      this.success =
        'Si el correo existe, se enviará un enlace de recuperación.';
    }, 1200);
  }
}
