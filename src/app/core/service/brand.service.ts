import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private baseUrl = environment.apiUrl + '/api/admin/brands';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    };
  }

  getAll() {
    return this.http.get<any[]>(this.baseUrl, this.getHeaders());
  }

  getById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  create(formData: FormData) {
    return this.http.post<any>(this.baseUrl, formData, this.getHeaders());
  }

  update(id: number, formData: FormData) {
    return this.http.put<any>(
      `${this.baseUrl}/${id}`,
      formData,
      this.getHeaders(),
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }
}
