import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  imageUrl?: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.apiUrl + '/api/admin/users';
  private profileUrl = environment.apiUrl + '/api/user/profile';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    };
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.profileUrl, this.getHeaders());
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.profileUrl, data, this.getHeaders());
  }

  getAll() {
    return this.http.get<any[]>(this.baseUrl, this.getHeaders());
  }

  create(data: any) {
    return this.http.post(this.baseUrl, data, this.getHeaders());
  }

  update(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.getHeaders());
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }
}
