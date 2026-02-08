import { Observable, of } from 'rxjs';
import { Order, OrderDetail } from '../../models/orders.models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  getOrders(): Observable<Order[]> {
    return of([
      {
        id: 1,
        client: { id: 1, nombres: 'Juan', apellidos: 'Pérez' },
        fecha: '2025-12-28',
        total: 250,
        status: 'Entregado',
        clientName: 'Juan Pérez',
      },
      {
        id: 2,
        client: { id: 2, nombres: 'María', apellidos: 'López' },
        fecha: '2025-12-27',
        total: 180,
        status: 'Pendiente',
        clientName: 'María López',
      },
    ]);
  }

  getOrderById(id: number): Observable<OrderDetail | undefined> {
    return of({
      id,
      client: { id: 1, nombres: 'Juan', apellidos: 'Pérez' },
      fecha: '2025-12-28',
      total: 250,
      status: 'Entregado',
      clientName: 'Juan Pérez',
      items: [
        {
          productId: 1,
          productName: 'Laptop Lenovo',
          price: 250,
          quantity: 1,
          subtotal: 250,
        },
      ],
    });
  }
}
