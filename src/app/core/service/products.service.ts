import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/products.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = environment.apiUrl + '/api/admin/products';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(formData: FormData) {
    return this.http.post(this.baseUrl, formData);
  }

  update(id: number, formData: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  search(q: string) {
    return this.http.get<Product[]>(`${this.baseUrl}/search?q=${q}`);
  }
}
