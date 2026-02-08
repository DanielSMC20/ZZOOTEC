import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService, UserProfile } from '../../core/service/user.service';
import { TableHeaderComponent } from '../../shared/components/table-header/table-header.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableHeaderComponent
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  user!: UserProfile;
  loading = true;
  saving = false;

  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      nombres: [''],
      apellidos: [''],
      email: [''],
      imageUrl: ['']
    });

    this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data;

        this.form.patchValue({
          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
          imageUrl: data.imageUrl ?? ''
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.loading = false;
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    this.saving = true;

    this.userService.updateProfile(this.form.getRawValue()).subscribe({
      next: (updated) => {
        this.user = updated;
        this.saving = false;
      },
      error: (err) => {
        console.error('Error actualizando perfil', err);
        this.saving = false;
      }
    });
  }
}

