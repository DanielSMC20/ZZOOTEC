import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from './clients.service';
import { Client } from '../../models/client.model';
import {
  TableColumn,
  TableComponent,
} from '../../shared/components/table/table.component';
import { TableHeaderComponent } from '../../shared/components/table-header/table-header.component';

@Component({
  standalone: true,
  templateUrl: './clients.component.html',
  imports: [TableComponent, TableHeaderComponent],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  allClients: Client[] = []; // Copia completa de clientes

  columns: TableColumn[] = [
    { key: 'fullName', label: 'Cliente' },
    { key: 'correo', label: 'Correo' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  constructor(
    private router: Router,
    private clientsService: ClientsService,
  ) {}

  ngOnInit() {
    this.clientsService.getClients().subscribe((data) => {
      const mappedData = data.map((c) => ({
        ...c,
        fullName: `${c.nombres} ${c.apellidos}`,
        estado: c.activo ? 'Activo' : 'Inactivo',
      })) as any;
      this.allClients = mappedData;
      this.clients = mappedData;
    });
  }

  onEditClient(client: Client) {
    this.router.navigate(['/admin/clients', client.id, 'edit']);
  }

  onViewClient(client: Client) {
    this.router.navigate(['/admin/clients', client.id]);
  }

  onAdd() {
    this.router.navigate(['/admin/clients/new']);
  }

  onSearchClient(value: string) {
    const searchTerm = value.toLowerCase().trim();

    if (!searchTerm) {
      this.clients = this.allClients;
      return;
    }

    this.clients = this.allClients.filter(
      (c: any) =>
        c.fullName.toLowerCase().includes(searchTerm) ||
        c.correo.toLowerCase().includes(searchTerm) ||
        c.telefono.includes(searchTerm),
    );
  }
}
