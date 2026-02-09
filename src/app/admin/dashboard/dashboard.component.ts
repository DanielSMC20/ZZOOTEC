import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { ClientsService } from '../clients/clients.service';
import { ProductService } from '../../core/service/products.service';
import { OrdersService } from '../orders/orders.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AiService } from '../../core/service/ai.service';
import { AiPanelComponent } from './components/ai-panel/ai-panel.component';
import { InventoryService } from '../../core/service/inventory.service';
import { InventoryMovement } from '../../models/inventory-movement.model';
import {
  SalesStatsService,
  SalesStatistics,
} from '../../core/service/sales-stats.service';

import {
  LucideAngularModule,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Package2,
  TrendingUpIcon,
  TrendingDownIcon,
  Calendar,
} from 'lucide-angular';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, RouterModule, AiPanelComponent, LucideAngularModule],
})
export class DashboardComponent implements OnInit {
  loading = true;

  preference: any = null;
  promotions: any[] = [];
  stockAlerts: any[] = [];
  showAlertsModal = false;

  salesStats: SalesStatistics = {
    totalSales: 0,
    averageDaily: 0,
    bestDay: null,
    growth: 0,
    dailySales: [],
    topProducts: [],
  };
  topProducts: any[] = [];
  bestSellers: any[] = [];

  icons = {
    sales: DollarSign,
    products: Package,
    orders: ShoppingCart,
    clients: Users,
    activity: Activity,
    entrada: TrendingUp,
    salida: TrendingDown,
    inventory: Package2,
    trendUp: TrendingUpIcon,
    trendDown: TrendingDownIcon,
    calendar: Calendar,
  };

  totalClients = 0;
  totalProducts = 0;
  totalOrders = 0;
  totalSales = 0;
  recentMovements: InventoryMovement[] = [];

  chartRef: any;

  constructor(
    private clientsService: ClientsService,
    private productsService: ProductService,
    private ordersService: OrdersService,
    private aiService: AiService,
    private inventoryService: InventoryService,
    private salesStatsService: SalesStatsService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadSalesStatistics();

    const modalKey = 'biModalShown';
    if (!sessionStorage.getItem(modalKey)) {
      this.showAlertsModal = true;
      sessionStorage.setItem(modalKey, '1');
    }

    // Cargar preferencias de IA (con manejo de errores)
    this.aiService.getPreferences(1).subscribe({
      next: (r: any) => {
        this.preference = r;
      },
      error: (err) => {
        console.warn('Servicio de IA no disponible:', err);
        this.preference = null;
      },
    });

    // Cargar promociones de IA (con manejo de errores)
    this.aiService.getPromotions().subscribe({
      next: (r: any) => {
        const items = r?.promotions ?? r ?? [];
        this.promotions = Array.isArray(items) ? items : [];
      },
      error: (err) => {
        console.warn('Servicio de IA no disponible:', err);
        this.promotions = [];
      },
    });

    // Cargar alertas de stock (con manejo de errores)
    this.aiService.getStockAlerts().subscribe({
      next: (r: any) => {
        const items = r?.alerts ?? r ?? [];
        this.stockAlerts = Array.isArray(items) ? items : [];
      },
      error: (err) => {
        console.warn('Alertas de stock no disponibles:', err);
        this.stockAlerts = [];
      },
    });
  }

  closeAlertsModal() {
    this.showAlertsModal = false;
  }

  loadDashboardData() {
    this.loading = true;

    forkJoin({
      clients: this.clientsService.getClients(),
      products: this.productsService.getProducts(),
      orders: this.ordersService.getOrders(),
      movements: this.inventoryService.getAllMovements(),
    }).subscribe(({ clients, products, orders, movements }) => {
      this.totalClients = clients.length;
      this.totalProducts = products.length;
      this.totalOrders = orders.length;

      this.totalSales = orders.reduce((sum, order) => sum + order.total, 0);

      // Últimos 5 movimientos
      this.recentMovements = movements
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      this.loading = false;
    });
  }

  loadSalesStatistics() {
    this.salesStatsService.getCurrentMonthStats().subscribe({
      next: (stats) => {
        this.salesStats = stats;
        this.topProducts = stats.topProducts;
        this.bestSellers = stats.topProducts.slice(0, 5);
      },
      error: (err) => {
        console.warn('Error cargando estadísticas de ventas:', err);
      },
    });
  }

  generateSampleData() {
    this.salesStatsService.seedSalesData().subscribe({
      next: () => {
        console.log('Datos de prueba generados exitosamente');
        this.loadSalesStatistics();
        this.loadDashboardData();
      },
      error: (err) => {
        console.error('Error generando datos:', err);
      },
    });
  }

  generateChartPath(): string {
    if (!this.salesStats || this.salesStats.dailySales.length === 0) {
      return 'M0,150 L500,150';
    }

    const sales = this.salesStats.dailySales;
    const maxSale = Math.max(...sales.map((s) => s.total));
    const width = 500;
    const height = 180;
    const padding = 20;

    const points = sales.map((sale, index) => {
      const x =
        (index / (sales.length - 1 || 1)) * (width - padding * 2) + padding;
      const y =
        height - ((sale.total / maxSale) * (height - padding * 2) + padding);
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  }

  getMovementIcon(type: string) {
    return type === 'ENTRADA' ? this.icons.entrada : this.icons.salida;
  }

  getMovementColor(type: string) {
    return type === 'ENTRADA' ? 'text-green-600' : 'text-red-600';
  }

  getMovementBgColor(type: string) {
    return type === 'ENTRADA' ? 'bg-green-100' : 'bg-red-100';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
