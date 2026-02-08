import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { CategoriesComponent } from './admin/categories/categories.component';
import { CategoryFormComponent } from './admin/categories/categories-form/categories-form.component';
import { UsersComponent } from './admin/users/users.component';
import { UserFormComponent } from './admin/users/user-form/user-form.component';

export const routes: Routes = [
  // 🔓 LOGIN (SIN LAYOUT)
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./admin/categories/categories.component').then(
            (m) => m.CategoriesComponent,
          ),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('./admin/categories/categories-form/categories-form.component').then(
            (m) => m.CategoryFormComponent,
          ),
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () =>
          import('./admin/categories/categories-form/categories-form.component').then(
            (m) => m.CategoryFormComponent,
          ),
      },
      {
        path: 'categories/:id',
        loadComponent: () =>
          import('./admin/categories/categories-form/categories-form.component').then(
            (m) => m.CategoryFormComponent,
          ),
      },

      {
        path: 'brands/new',
        loadComponent: () =>
          import('./admin/brand/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent,
          ),
      },
      {
        path: 'brands/:id/edit',
        loadComponent: () =>
          import('./admin/brand/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent,
          ),
      },
      {
        path: 'brands/:id',
        loadComponent: () =>
          import('./admin/brand/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent,
          ),
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./admin/products/products.component').then(
            (m) => m.ProductsComponent,
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./admin/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
      },

      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./admin/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./admin/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./admin/clients/clients.component').then(
            (m) => m.ClientsComponent,
          ),
      },
      {
        path: 'clients/new',
        loadComponent: () =>
          import('./admin/clients/clients-form/clients-form.component').then(
            (m) => m.ClientsFormComponent,
          ),
      },
      // 🔥 PRIMERO la ruta de edición (más específica)
      {
        path: 'clients/:id/edit',
        loadComponent: () =>
          import('./admin/clients/clients-form/clients-form.component').then(
            (m) => m.ClientsFormComponent,
          ),
      },
      {
        path: 'clients/:id',
        loadComponent: () =>
          import('./admin/clients/clients-form/clients-form.component').then(
            (m) => m.ClientsFormComponent,
          ),
      },

      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/orders/orders.component').then(
            (m) => m.OrdersComponent,
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./admin/orders/order-detail/order-detail.component').then(
            (m) => m.OrderDetailComponent,
          ),
      },

      {
        path: 'brands',
        loadComponent: () =>
          import('./admin/brand/brand.component').then(
            (m) => m.BrandsComponent,
          ),
      },

      {
        path: 'analytics',
        loadComponent: () =>
          import('./admin/analytics/analytics.component').then(
            (m) => m.AnalyticsComponent,
          ),
      },

      {
        path: 'market-intelligence',
        loadComponent: () =>
          import('./admin/market-intelligence/market-intelligence.component').then(
            (m) => m.MarketIntelligenceComponent,
          ),
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./admin/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./admin/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/users/users.component').then((m) => m.UsersComponent),
      },

      {
        path: 'users/new',
        loadComponent: () =>
          import('./admin/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent,
          ),
      },
      {
        path: 'users/:id/edit',
        loadComponent: () =>
          import('./admin/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent,
          ),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./admin/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent,
          ),
      },
    ],
  },
  // REDIRECCIONES
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./admin/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
