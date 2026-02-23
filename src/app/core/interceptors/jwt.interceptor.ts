import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  if (req.url.includes('cloudinary.com')) {
    return next(req);
  }

  const token = sessionStorage.getItem('token');
  
  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el token expiró (401 Unauthorized o 403 Forbidden)
      if (error.status === 401 || error.status === 403) {
        // Limpiar sesión
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Redireccionar al login
        router.navigate(['/auth/login']);
      }
      
      // Re-lanzar el error para que los componentes lo manejen si lo necesitan
      throw error;
    })
  );
};