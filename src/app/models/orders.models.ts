export interface OrderItem {
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
}

export interface Order {
  id: number;
  fecha: string;
  total: number;
  status: string;
  channel?: string;
  client: Client;
  items?: OrderItem[];

  // campos calculados frontend
  clientName?: string;
  dateFormatted?: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}
