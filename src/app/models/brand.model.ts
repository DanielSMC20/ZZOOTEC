export interface Brand {
  logoUrl?: string;
  imageUrl?: string; // alias para compatibilidad con tabla
  id: number;
  name: string;
  active: boolean;
  status?: string; // solo frontend
}
