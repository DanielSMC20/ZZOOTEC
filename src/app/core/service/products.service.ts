import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/products.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = environment.apiUrl + '/api/admin/products';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    };
  }

  getProducts() {
    return this.http.get<Product[]>(this.baseUrl, this.getHeaders());
  }

  getById(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  create(formData: FormData) {
    return this.http.post(this.baseUrl, formData, this.getHeaders());
  }

  update(id: number, formData: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, formData, this.getHeaders());
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  search(q: string) {
    return this.http.get<Product[]>(
      `${this.baseUrl}/search?q=${q}`,
      this.getHeaders(),
    );
  }
}
