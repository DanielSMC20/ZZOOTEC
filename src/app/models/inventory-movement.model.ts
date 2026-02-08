export type MovementType = 'ENTRADA' | 'SALIDA';
export type MovementOrigin = 'PEDIDO' | 'AJUSTE' | 'DEVOLUCION';

export interface InventoryMovement {
  id: number;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
  };
  type: MovementType;
  quantity: number;
  date: string; // ISO format
  origin: MovementOrigin;
}
