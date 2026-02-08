export type CanalOrigen = 'WEB' | 'WHATSAPP' | 'TIENDA';

export interface Client {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  canalOrigen: CanalOrigen;
  imageUrl?: string;
  fechaRegistro: string; // ISO
  activo: boolean;
}
