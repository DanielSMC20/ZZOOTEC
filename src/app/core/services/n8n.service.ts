import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface N8nWebhookResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface OrderNotification {
  orderNumber: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryAddress?: string;
  estimatedTime?: string;
  trackingUrl?: string;
}

export interface StockAlert {
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
  categoryName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class N8nService {
  private n8nBaseUrl = environment.n8nUrl;

  constructor(private http: HttpClient) {}

  /**
   * Enviar notificación de orden via n8n
   * @param orderData Datos de la orden
   */
  sendOrderNotification(
    orderData: OrderNotification,
  ): Observable<N8nWebhookResponse> {
    const webhookUrl = `${this.n8nBaseUrl}/webhook/order-notification`;
    return this.http.post<N8nWebhookResponse>(webhookUrl, orderData);
  }

  /**
   * Trigger manual de alerta de stock bajo
   * @param alerts Lista de productos con stock bajo
   */
  triggerStockAlert(alerts: StockAlert[]): Observable<N8nWebhookResponse> {
    const webhookUrl = `${this.n8nBaseUrl}/webhook/stock-alert-manual`;
    return this.http.post<N8nWebhookResponse>(webhookUrl, { products: alerts });
  }

  /**
   * Solicitar reporte manual de ventas
   * @param date Fecha del reporte (formato: YYYY-MM-DD)
   */
  requestSalesReport(date?: string): Observable<N8nWebhookResponse> {
    const webhookUrl = `${this.n8nBaseUrl}/webhook/sales-report-manual`;
    const reportDate = date || new Date().toISOString().split('T')[0];
    return this.http.post<N8nWebhookResponse>(webhookUrl, { date: reportDate });
  }

  /**
   * Solicitar análisis automático para sugerencias de promociones
   * @param productIds IDs de productos a analizar (opcional)
   */
  requestPromotionAnalysis(
    productIds?: number[],
  ): Observable<N8nWebhookResponse> {
    const webhookUrl = `${this.n8nBaseUrl}/webhook/promotion-analysis`;
    return this.http.post<N8nWebhookResponse>(webhookUrl, {
      productIds: productIds || [],
      requestedBy: 'manual',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Enviar notificación personalizada via WhatsApp
   * @param phone Número de teléfono (formato: +51999999999)
   * @param message Mensaje a enviar
   */
  sendCustomWhatsApp(
    phone: string,
    message: string,
  ): Observable<N8nWebhookResponse> {
    const webhookUrl = `${this.n8nBaseUrl}/webhook/custom-whatsapp`;
    return this.http.post<N8nWebhookResponse>(webhookUrl, {
      phone,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Enviar correo personalizado
   * @param to Email destinatario
   * @param subject Asunto
   * @param body Cuerpo del mensaje (HTML o texto)
   */
  sendCustomEmail(
    to: string,
    subject: string,
    body: string,
    isHtml: boolean = false,
  ): Observable<N8nWebhookResponse> {
    const webhookUrl = `${this.n8nBaseUrl}/webhook/custom-email`;
    return this.http.post<N8nWebhookResponse>(webhookUrl, {
      to,
      subject,
      body,
      isHtml,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Verificar estado de n8n
   */
  checkN8nHealth(): Observable<any> {
    return this.http.get(`${this.n8nBaseUrl}/healthz`);
  }

  /**
   * Test de conexión con n8n
   */
  testConnection(): Observable<boolean> {
    return new Observable((observer) => {
      this.checkN8nHealth().subscribe({
        next: () => {
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        },
      });
    });
  }
}
