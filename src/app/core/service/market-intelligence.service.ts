import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MarketIntelligenceService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOverview() {
    return this.http.get(`${this.api}/api/market/overview`);
  }

  getTopProducts(limit = 5) {
    return this.http.get(`${this.api}/api/market/top-products?limit=${limit}`);
  }

  getSlowProducts(days = 30, limit = 10) {
    return this.http.get(
      `${this.api}/api/market/slow-products?days=${days}&limit=${limit}`,
    );
  }

  getInactiveClients(days = 60, limit = 10) {
    return this.http.get(
      `${this.api}/api/market/inactive-clients?days=${days}&limit=${limit}`,
    );
  }

  getCategoryStock() {
    return this.http.get(`${this.api}/api/market/category-stock`);
  }
}
