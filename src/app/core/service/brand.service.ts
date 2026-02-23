import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private baseUrl = environment.apiUrl + '/api/admin/brands';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(formData: FormData) {
    return this.http.post<any>(this.baseUrl, formData);
  }

  update(id: number, formData: FormData) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
