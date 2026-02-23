import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DailySale {
  day: number;
  date: string;
  total: number;
  ordersCount: number;
}

export interface SalesStatistics {
  totalSales: number;
  averageDaily: number;
  bestDay: DailySale | null;
  growth: number;
  dailySales: DailySale[];
  topProducts: any[];
}

@Injectable({ providedIn: 'root' })
export class SalesStatsService {
  private baseUrl = environment.apiUrl + '/api/sales';

  constructor(private http: HttpClient) {}

  getAllSales(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  seedSalesData(): Observable<string> {
    return this.http.post<string>(this.baseUrl + '/seed', {});
  }

  getCurrentMonthStats(): Observable<SalesStatistics> {
    return this.getAllSales().pipe(map((sales) => this.calculateStats(sales)));
  }

  private calculateStats(sales: any[]): SalesStatistics {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Ventas del mes actual
    const currentMonthSales = sales.filter((s) => {
      const saleDate = new Date(s.date);
      return (
        saleDate.getMonth() === currentMonth &&
        saleDate.getFullYear() === currentYear
      );
    });

    // Ventas del mes anterior
    const previousMonthSales = sales.filter((s) => {
      const saleDate = new Date(s.date);
      return (
        saleDate.getMonth() === previousMonth &&
        saleDate.getFullYear() === previousYear
      );
    });

    // Agrupar por día
    const dailySalesMap = new Map<number, DailySale>();

    currentMonthSales.forEach((sale) => {
      const saleDate = new Date(sale.date);
      const day = saleDate.getDate();
      const existing = dailySalesMap.get(day) || {
        day,
        date: saleDate.toISOString().split('T')[0],
        total: 0,
        ordersCount: 0,
      };
      existing.total += sale.total || 0;
      existing.ordersCount += 1;
      dailySalesMap.set(day, existing);
    });

    const dailySales = Array.from(dailySalesMap.values()).sort(
      (a, b) => a.day - b.day,
    );

    const totalCurrentMonth = currentMonthSales.reduce(
      (sum, s) => sum + (s.total || 0),
      0,
    );
    const totalPreviousMonth = previousMonthSales.reduce(
      (sum, s) => sum + (s.total || 0),
      0,
    );

    const averageDaily =
      dailySales.length > 0 ? totalCurrentMonth / dailySales.length : 0;

    const bestDay =
      dailySales.length > 0
        ? dailySales.reduce((max, d) => (d.total > max.total ? d : max))
        : null;

    const growth =
      totalPreviousMonth > 0
        ? ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100
        : 0;

    const topProducts = this.getTopProducts(currentMonthSales);

    return {
      totalSales: totalCurrentMonth,
      averageDaily,
      bestDay,
      growth,
      dailySales,
      topProducts,
    };
  }

  private getTopProducts(sales: any[]): any[] {
    const productMap = new Map<
      string | number,
      {
        name: string;
        quantity: number;
        total: number;
        totalRevenue?: number;
        price: number;
      }
    >();

    sales.forEach((sale) => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item: any) => {
          const productName =
            item.productName || item.product?.name || 'Desconocido';
          const key = item.productId || item.product?.id || productName;
          const existing = productMap.get(key) || {
            name: productName,
            quantity: 0,
            total: 0,
            totalRevenue: 0,
            price: item.price || 0,
          };
          existing.quantity += item.quantity || 0;
          existing.total += item.subtotal || 0;
          existing.totalRevenue = existing.total; // Para compatibilidad con el template
          productMap.set(key, existing);
        });
      }
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }
}
