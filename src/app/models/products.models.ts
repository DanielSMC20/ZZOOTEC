export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  active: boolean;

  imageUrl?: string;

  category?: {
    id: number;
    name: string;
    imageUrl?: string;
  };

  brand?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}
