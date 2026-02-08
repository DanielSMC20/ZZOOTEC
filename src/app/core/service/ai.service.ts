import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPreferences(clientId: number) {
    return this.http.get(`${this.api}/api/ai/preferences/${clientId}`);
  }

  getPromotions() {
    return this.http.get(`${this.api}/api/intelligence/promotions`);
  }

  getStockAlerts() {
    return this.http.get(`${this.api}/api/intelligence/stock-alerts`);
  }
}
