import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService, UserProfile } from '../../core/service/user.service';
import { ImageService } from '../../core/service/image.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user!: UserProfile;
  loading = true;
  saving = false;
  isEditing = false;
  uploadingImage = false;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      nombres: [''],
      apellidos: [''],
      email: [''],
      telefono: [''],
      fechaNacimiento: [''],
      imageUrl: [''],
    });

    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data;

        this.form.patchValue({
          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
          telefono: data.telefono ?? '',
          fechaNacimiento: data.fechaNacimiento ?? '',
          imageUrl: data.imageUrl ?? '',
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.loading = false;
      },
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.selectedFile = null;
      this.imagePreview = null;
      this.form.patchValue({
        nombres: this.user.nombres,
        apellidos: this.user.apellidos,
        email: this.user.email,
        telefono: this.user.telefono ?? '',
        fechaNacimiento: this.user.fechaNacimiento ?? '',
        imageUrl: this.user.imageUrl ?? '',
      });
    }
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

  triggerFileInput() {
    const fileInput = document.getElementById(
      'profileImageInput',
    ) as HTMLInputElement;
    fileInput?.click();
  }

  save() {
    if (this.form.invalid) return;

    this.saving = true;

    const uploadImage$ = this.selectedFile
      ? this.imageService.upload(this.selectedFile)
      : of(this.form.value.imageUrl);

    uploadImage$
      .pipe(
        switchMap((imageUrl) => {
          const updateData = {
            nombres: this.form.value.nombres,
            apellidos: this.form.value.apellidos,
            email: this.form.value.email,
            telefono: this.form.value.telefono || undefined,
            fechaNacimiento: this.form.value.fechaNacimiento || undefined,
            imageUrl: imageUrl || undefined,
          };
          return this.userService.updateProfile(updateData);
        }),
      )
      .subscribe({
        next: (updated) => {
          this.user = updated;
          this.saving = false;
          this.isEditing = false;
          this.selectedFile = null;
          this.imagePreview = null;
        },
        error: (err) => {
          console.error('Error actualizando perfil', err);
          this.saving = false;
          alert('Error al actualizar el perfil');
        },
      });
  }
}
