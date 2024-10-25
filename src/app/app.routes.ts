import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { ClientsComponent } from './pages/admin/clients/clients.component';
import { LoginAdminComponent } from './pages/admin/login/login.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { SalesComponent } from './pages/admin/sales/sales.component';

export const routes: Routes = [
    { path: '',component: HomeComponent },
    { path: 'carrito',component: CartComponent },
    { path: 'sobre-nosotros',component: AboutUsComponent },
    { path: 'contacto',component: ContactComponent },
    { path: 'admin',component: AdminComponent },
    { path: 'admin/clients',component: ClientsComponent },
    { path: 'admin/login',component: LoginAdminComponent},
    { path: 'admin/products',component: ProductsComponent},
    { path: 'admin/sales',component: SalesComponent },
    { path: '**', redirectTo: ''}
];
