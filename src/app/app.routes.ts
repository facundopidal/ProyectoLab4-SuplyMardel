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
import { AuthGuard } from './services/auth/userauth.guard';
import { AdminGuard } from './services/auth/adminauth.guard';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SuccessfulPurchaseComponent } from './pages/successful-purchase/successful-purchase.component';
import { CheckoutComponent } from './pages/buy/checkout/checkout.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreateProductComponent } from './pages/admin/create-product/create-product.component';
import { EditProductComponent } from './pages/admin/edit-product/edit-product.component';
import { AddAddressComponent } from './pages/add-address/add-address.component';
import { FilteredProductsComponent } from './pages/filtered-products/filtered-products.component';
import { LogoutGuard } from './services/auth/logout.guard';
import { NotAdminGuard } from './services/auth/not-admin.guard';
import { SearchedProductsComponent } from './pages/searched-products/searched-products.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component';
import { ClientDetailsComponent } from './pages/admin/client-details/client-details.component';

export const routes: Routes = [
    { path: '',component: HomeComponent },
    { path: 'cart',component: CartComponent, canActivate: [AuthGuard, NotAdminGuard] },
    { path: 'cart/:id',component: CartComponent, canActivate: [AuthGuard, NotAdminGuard] },
    { path: 'add-address',component: AddAddressComponent, canActivate: [AuthGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: 'password-recovery', component: PasswordRecoveryComponent, canActivate: [LogoutGuard]},
    { path: 'about-us',component: AboutUsComponent },
    { path: 'contact',component: ContactComponent },
    { path: 'login', component: LoginComponent,canActivate: [LogoutGuard]},
    { path: 'my-account', component: AccountComponent, canActivate: [AuthGuard]},
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'register', component: RegisterComponent, canActivate: [LogoutGuard]},
    { path: 'admin',component: AdminComponent, canActivate: [AdminGuard] },
    { path: 'admin/clients',component: ClientsComponent, canActivate: [AdminGuard] },
    { path: 'admin/client-details/:id', component: ClientDetailsComponent, canActivate: [AdminGuard] },
    { path: 'admin/products',component: ProductsAdminComponent, canActivate: [AdminGuard] },
    { path: 'admin/sales',component: SalesComponent, canActivate: [AdminGuard] }, 
    { path: 'admin/create-product',component: CreateProductComponent, canActivate: [AdminGuard] }, 
    { path: 'admin/edit-product/:id',component: EditProductComponent, canActivate: [AdminGuard] }, 
    { path: 'successfulpurchase',component: SuccessfulPurchaseComponent }, 
    { path: 'checkout',component: CheckoutComponent, canActivate: [AuthGuard, NotAdminGuard] }, 
    { path: 'filtered-products', component: FilteredProductsComponent },
    { path: 's', component: SearchedProductsComponent},
    { path: '**', redirectTo: ''}
];


