import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { OrderDetail } from '../../../models/orders.models';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  order?: OrderDetail;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.ordersService.getOrderById(id).subscribe({
      next: (data) => (this.order = data),
      error: (err) => console.error('Error cargando orden', err),
    });
  }

  get total(): number {
    return (
      this.order?.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ) ?? 0
    );
  }

  get clientName(): string {
    if (!this.order?.client) return '-';
    return `${this.order.client.nombres} ${this.order.client.apellidos}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  back() {
    this.router.navigate(['/admin/orders']);
  }
}
