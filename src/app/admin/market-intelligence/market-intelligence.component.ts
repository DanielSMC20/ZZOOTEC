import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketIntelligenceService } from '../../core/service/market-intelligence.service';
import { AiService } from '../../core/service/ai.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './market-intelligence.component.html',
  styleUrls: ['./market-intelligence.component.css'],
  imports: [CommonModule, RouterModule],
})
export class MarketIntelligenceComponent implements OnInit {
  loading = true;

  overview: any = null;
  topProducts: any[] = [];
  slowProducts: any[] = [];
  inactiveClients: any[] = [];
  categoryStock: any[] = [];
  stockAlerts: any[] = [];
  promotions: any[] = [];

  constructor(
    private marketService: MarketIntelligenceService,
    private aiService: AiService,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;

    this.marketService.getOverview().subscribe({
      next: (r: any) => (this.overview = r),
      error: () => (this.overview = null),
    });

    this.marketService.getTopProducts(6).subscribe({
      next: (r: any) => (this.topProducts = Array.isArray(r) ? r : []),
      error: () => (this.topProducts = []),
    });

    this.marketService.getSlowProducts(30, 6).subscribe({
      next: (r: any) => (this.slowProducts = Array.isArray(r) ? r : []),
      error: () => (this.slowProducts = []),
    });

    this.marketService.getInactiveClients(60, 6).subscribe({
      next: (r: any) => (this.inactiveClients = Array.isArray(r) ? r : []),
      error: () => (this.inactiveClients = []),
    });

    this.marketService.getCategoryStock().subscribe({
      next: (r: any) => (this.categoryStock = Array.isArray(r) ? r : []),
      error: () => (this.categoryStock = []),
    });

    this.aiService.getStockAlerts().subscribe({
      next: (r: any) => {
        const items = r?.alerts ?? r ?? [];
        this.stockAlerts = Array.isArray(items) ? items : [];
      },
      error: () => (this.stockAlerts = []),
    });

    this.aiService.getPromotions().subscribe({
      next: (r: any) => {
        const items = r?.promotions ?? r ?? [];
        this.promotions = Array.isArray(items) ? items : [];
      },
      error: () => (this.promotions = []),
    });

    this.loading = false;
  }

  formatCurrency(value: number | null | undefined) {
    if (value === null || value === undefined) return 'S/ 0';
    return `S/ ${value.toFixed(2)}`;
  }
}
