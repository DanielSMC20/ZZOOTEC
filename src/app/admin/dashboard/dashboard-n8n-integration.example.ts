/**
 * EJEMPLO DE INTEGRACIÓN N8N EN EL DASHBOARD
 *
 * Este archivo muestra cómo integrar el servicio N8nService
 * en el componente del dashboard para automatizaciones.
 *
 * NO reemplaza tu dashboard actual, es solo referencia.
 */

import { Component, OnInit } from '@angular/core';
import { N8nService } from '../../core/services/n8n.service';

@Component({
  selector: 'app-dashboard-n8n-example',
  template: '<div>Ejemplo de integración n8n</div>',
  standalone: true,
})
export class DashboardComponentWithN8n implements OnInit {
  // Propiedades del dashboard (ejemplo - usa las de tu dashboard real)
  stockAlerts: any[] = [];
  totalOrders: number = 0;
  totalSales: number = 0;
  totalProducts: number = 0;
  totalClients: number = 0;
  topProducts: any[] = [];

  // Inyectar el servicio
  constructor(
    private n8nService: N8nService,
    // ... tus otros servicios
  ) {}

  ngOnInit(): void {
    // Tu código existente...

    // Opcional: Verificar conexión con n8n al cargar
    this.checkN8nConnection();
  }

  /**
   * Verificar si n8n está disponible
   */
  checkN8nConnection() {
    this.n8nService.testConnection().subscribe({
      next: (isConnected) => {
        if (isConnected) {
          console.log('✅ n8n está disponible');
        } else {
          console.warn('⚠️ n8n no está disponible');
        }
      },
      error: (err) => console.error('Error al conectar con n8n', err),
    });
  }

  /**
   * EJEMPLO 1: Enviar alerta manual de stock bajo
   * Trigger al hacer click en un botón
   */
  sendStockAlertManually() {
    // Convertir tus stockAlerts a formato compatible
    const alerts = this.stockAlerts
      .filter((alert) => alert.stock < (alert.minStock || 10))
      .map((alert) => ({
        productId: alert.id || 0,
        productName: alert.name || 'Producto',
        currentStock: alert.stock || 0,
        minStock: alert.minStock || 10,
        categoryName: alert.category || 'General',
      }));

    if (alerts.length === 0) {
      alert('No hay alertas de stock bajo en este momento');
      return;
    }

    this.n8nService.triggerStockAlert(alerts).subscribe({
      next: (response) => {
        console.log('Alerta enviada:', response);
        alert(
          `✅ Alerta enviada correctamente!\n${alerts.length} productos notificados`,
        );
      },
      error: (err) => {
        console.error('Error al enviar alerta:', err);
        alert('❌ Error al enviar alerta. Verifica que n8n esté corriendo.');
      },
    });
  }

  /**
   * EJEMPLO 2: Solicitar reporte de ventas manual
   */
  requestDailySalesReport() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    this.n8nService.requestSalesReport(today).subscribe({
      next: (response) => {
        console.log('Reporte solicitado:', response);
        alert(
          '📊 Reporte en proceso.\nLo recibirás por email en unos minutos.',
        );
      },
      error: (err) => {
        console.error('Error al solicitar reporte:', err);
        alert('❌ Error al solicitar reporte.');
      },
    });
  }

  /**
   * EJEMPLO 3: Solicitar análisis para promociones
   */
  requestPromotionSuggestions() {
    // Puedes pasar IDs específicos o dejar vacío para analizar todos
    const productIds = this.topProducts
      .filter((p) => p.quantity < 10) // Productos con pocas ventas
      .map((p) => p.id);

    this.n8nService.requestPromotionAnalysis(productIds).subscribe({
      next: (response) => {
        console.log('Análisis solicitado:', response);
        alert('💡 Analizando productos.\nRecibirás sugerencias por WhatsApp.');
      },
      error: (err) => {
        console.error('Error al solicitar análisis:', err);
      },
    });
  }

  /**
   * EJEMPLO 4: Enviar notificación personalizada por WhatsApp
   */
  sendCustomWhatsAppNotification() {
    const adminPhone = '+51999999999'; // Tu número
    const message = `
🔔 *ALERTA IMPORTANTE* 

El dashboard ha detectado:
• ${this.totalOrders} órdenes pendientes
• ${this.stockAlerts.length} productos con stock bajo
• Ventas del día: S/ ${this.totalSales.toFixed(2)}

_Mensaje automático de ZOOTEC_
    `.trim();

    this.n8nService.sendCustomWhatsApp(adminPhone, message).subscribe({
      next: (response) => {
        console.log('WhatsApp enviado:', response);
        alert('✅ WhatsApp enviado correctamente');
      },
      error: (err) => {
        console.error('Error al enviar WhatsApp:', err);
      },
    });
  }

  /**
   * EJEMPLO 5: Enviar reporte por email personalizado
   */
  sendCustomEmailReport() {
    const adminEmail = 'admin@zzootec.com';
    const subject = `Reporte Dashboard - ${new Date().toLocaleDateString()}`;

    const htmlBody = `
      <h2>Resumen del Dashboard</h2>
      <table border="1" cellpadding="10">
        <tr>
          <th>Métrica</th>
          <th>Valor</th>
        </tr>
        <tr>
          <td>Ventas Totales</td>
          <td>S/ ${this.totalSales.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Órdenes</td>
          <td>${this.totalOrders}</td>
        </tr>
        <tr>
          <td>Productos</td>
          <td>${this.totalProducts}</td>
        </tr>
        <tr>
          <td>Clientes</td>
          <td>${this.totalClients}</td>
        </tr>
      </table>
      
      <h3>Top 5 Productos</h3>
      <ul>
        ${this.topProducts
          .slice(0, 5)
          .map(
            (p) =>
              `<li>${p.name}: ${p.quantity} unidades - S/ ${p.total?.toFixed(2)}</li>`,
          )
          .join('')}
      </ul>
      
      <p><em>Generado automáticamente por ZOOTEC</em></p>
    `;

    this.n8nService
      .sendCustomEmail(adminEmail, subject, htmlBody, true)
      .subscribe({
        next: (response) => {
          console.log('Email enviado:', response);
          alert('📧 Email enviado correctamente');
        },
        error: (err) => {
          console.error('Error al enviar email:', err);
        },
      });
  }

  /**
   * EJEMPLO 6: Notificar cambio de estado de orden (desde otro componente)
   * Este método iría en tu OrdersComponent, no en Dashboard
   */
  notifyOrderStatusChange(order: any, newStatus: string) {
    const notification = {
      orderNumber: order.orderNumber || order.id?.toString() || 'ORD-XXX',
      status: newStatus,
      customer: {
        name: order.customerName || 'Cliente',
        email: order.customerEmail || 'cliente@email.com',
        phone: order.customerPhone || '+51999999999',
      },
      items: order.items || [],
      total: order.total || 0,
      deliveryAddress: order.deliveryAddress || 'Dirección no especificada',
      estimatedTime: '30-45 minutos',
      trackingUrl: `https://zzootec.com/track/${order.id}`,
    };

    this.n8nService.sendOrderNotification(notification).subscribe({
      next: (response) => {
        console.log('Notificación enviada:', response);
        // Opcional: mostrar toast/snackbar de confirmación
      },
      error: (err) => {
        console.error('Error al notificar orden:', err);
      },
    });
  }

  /**
   * EJEMPLO 7: Automatizar alerta cuando se detecta stock crítico
   * Llamar esto cuando se actualiza el inventario
   */
  autoCheckStockAndAlert() {
    const criticalStock = this.stockAlerts.filter(
      (alert) => alert.stock < 5, // Stock crítico < 5
    );

    if (criticalStock.length > 0) {
      const alerts = criticalStock.map((alert) => ({
        productId: alert.id,
        productName: alert.name,
        currentStock: alert.stock,
        minStock: alert.minStock || 10,
      }));

      // Enviar alerta automáticamente
      this.n8nService.triggerStockAlert(alerts).subscribe({
        next: () => console.log('✅ Alerta automática enviada'),
        error: (err) => console.error('Error en alerta automática:', err),
      });
    }
  }

  // ============================================
  // EJEMPLO DE HTML PARA AGREGAR BOTONES
  // ============================================
  /*
  
  Agrega estos botones en dashboard.component.html:

  <!-- Sección de Automatizaciones n8n -->
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border">
    <h3 class="text-lg font-semibold mb-4">🤖 Automatizaciones</h3>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      
      <button 
        (click)="sendStockAlertManually()"
        class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
        🔔 Alerta Stock
      </button>
      
      <button 
        (click)="requestDailySalesReport()"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        📊 Reporte Ventas
      </button>
      
      <button 
        (click)="requestPromotionSuggestions()"
        class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
        💡 Sugerencias
      </button>
      
      <button 
        (click)="sendCustomWhatsAppNotification()"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
        📱 WhatsApp Test
      </button>
      
    </div>
  </div>

  */
}
