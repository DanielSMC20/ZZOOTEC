import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Client, CanalOrigen } from '../../models/client.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly API_URL = environment.apiUrl + '/api/clients';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.API_URL);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/${id}`);
  }

  createClient(data: any): Observable<Client> {
    // Enviar JSON al backend (el controlador espera @RequestBody JSON)
    return this.http.post<Client>(this.API_URL, data);
  }

  // 📌 actualizar cliente
  updateClient(id: number, data: any): Observable<Client> {
    return this.http.put<Client>(`${this.API_URL}/${id}`, data);
  }

  // 📌 desactivar (soft delete)
  deactivateClient(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/deactivate`, {});
  }
}
