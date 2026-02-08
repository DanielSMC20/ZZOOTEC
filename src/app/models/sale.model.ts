export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Client {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
}

export interface Sale {
  id: number;
  channel: string;
  date: string;
  total: number;
  client: Client;
  items: SaleItem[];
}
