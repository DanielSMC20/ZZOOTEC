import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryMovement } from '../../models/inventory-movement.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/api/inventory-movements`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los movimientos de inventario
   */
  getAllMovements(): Observable<InventoryMovement[]> {
    return this.http.get<InventoryMovement[]>(this.apiUrl);
  }

  /**
   * Obtener movimientos por producto
   */
  getMovementsByProduct(productId: number): Observable<InventoryMovement[]> {
    return this.http.get<InventoryMovement[]>(
      `${this.apiUrl}/product/${productId}`,
    );
  }
}
