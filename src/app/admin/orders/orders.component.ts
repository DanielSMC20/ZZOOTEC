import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  TableComponent,
  TableColumn,
} from '../../shared/components/table/table.component';
import { TableHeaderComponent } from '../../shared/components/table-header/table-header.component';
import { OrdersService } from '../../core/service/orders.service';
import { Order } from '../../models/orders.models';

@Component({
  standalone: true,
  imports: [TableComponent, TableHeaderComponent],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'clientName', label: 'Cliente' },
    { key: 'dateFormatted', label: 'Fecha' },
    { key: 'total', label: 'Total' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  constructor(
    private ordersService: OrdersService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.map((o) => ({
          ...o,

          clientName: `${o.client.nombres} ${o.client.apellidos}`,
          dateFormatted: this.formatDate(o.fecha),

          status: o.status,
        }));
      },
      error: (err) => console.error('Error cargando órdenes', err),
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  }

  onViewOrder(order: Order) {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
