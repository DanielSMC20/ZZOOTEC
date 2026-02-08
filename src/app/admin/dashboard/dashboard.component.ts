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
  LucideAngularModule,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Package2,
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

  icons = {
    sales: DollarSign,
    products: Package,
    orders: ShoppingCart,
    clients: Users,
    activity: Activity,
    entrada: TrendingUp,
    salida: TrendingDown,
    inventory: Package2,
  };

  totalClients = 0;
  totalProducts = 0;
  totalOrders = 0;
  totalSales = 0;
  recentMovements: InventoryMovement[] = [];

  constructor(
    private clientsService: ClientsService,
    private productsService: ProductService,
    private ordersService: OrdersService,
    private aiService: AiService,
    private inventoryService: InventoryService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();

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
}
