export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;

  // para la tabla
  status?: string;
}
