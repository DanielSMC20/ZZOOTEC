import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = environment.apiUrl + '/api/admin/categories';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  create(formData: FormData) {
    return this.http.post<Category>(this.baseUrl, formData);
  }

  update(id: number, formData: FormData) {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
