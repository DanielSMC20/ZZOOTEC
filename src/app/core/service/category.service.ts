import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = environment.apiUrl + '/api/admin/categories';

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
    return this.http.get<Category[]>(this.baseUrl, this.getHeaders());
  }

  getById(id: number) {
    return this.http.get<Category>(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  create(formData: FormData) {
    return this.http.post<Category>(this.baseUrl, formData, this.getHeaders());
  }

  update(id: number, formData: FormData) {
    return this.http.put<Category>(
      `${this.baseUrl}/${id}`,
      formData,
      this.getHeaders(),
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }
}
