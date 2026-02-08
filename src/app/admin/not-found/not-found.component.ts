import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  template: `
    <div class="h-screen flex flex-col items-center justify-center">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="text-gray-500 mt-2">Página no encontrada</p>

      <button
        class="mt-6 px-6 py-3 rounded-xl bg-[#C9A24D] text-white"
        (click)="goHome()">
        Volver al inicio
      </button>
    </div>
  `
})
export class NotFoundComponent {

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/admin'], { replaceUrl: true });
  }
}
