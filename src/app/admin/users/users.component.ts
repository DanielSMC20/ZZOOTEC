import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { TableHeaderComponent } from '../../shared/components/table-header/table-header.component';

@Component({
  standalone: true,
  imports: [TableComponent, TableHeaderComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  columns: TableColumn[] = [
    { key: 'email', label: 'Email' },
    { key: 'rolesText', label: 'Roles' },
    { key: 'status', label: 'Estado', type: 'badge' },
    { key: 'actions', label: 'Acciones', type: 'actions' }
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = res.map(u => ({
          ...u,
          rolesText: u.roles.join(', '),
          status: u.activo ? 'Activo' : 'Inactivo'
        }));
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });
  }

  onAdd() {
    this.router.navigate(['/admin/users/new']);
  }

  onEdit(user: any) {
    this.router.navigate(['/admin/users', user.id, 'edit']);
  }

  onView(user: any) {
    this.router.navigate(['/admin/users', user.id]);
  }
}
