import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { ClientsComponent } from './pages/admin/clients/clients.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductsAdminComponent } from './pages/admin/products/products.component';
import { SalesComponent } from './pages/admin/sales/sales.component';
import { AccountComponent } from './pages/account/account.component';
import { AuthGuard } from './services/userauth.guard';
import { AdminGuard } from './services/adminauth.guard';

export const routes: Routes = [
    { path: '',component: HomeComponent },
    { path: 'cart',component: CartComponent },
    { path: 'about-us',component: AboutUsComponent },
    { path: 'contact',component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'my-account', component: AccountComponent },
    { path: 'admin',component: AdminComponent, canActivate: [AdminGuard] },
    { path: 'admin/clients',component: ClientsComponent },
    { path: 'admin/products',component: ProductsAdminComponent},
    { path: 'admin/sales',component: SalesComponent },
    { path: '**', redirectTo: ''}
];
