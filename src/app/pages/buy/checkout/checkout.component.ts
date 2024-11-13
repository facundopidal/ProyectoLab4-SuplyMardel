import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../interfaces/product';
import { ApiProductsService } from '../../../services/ecommerce/api-products.service';
import { forkJoin } from 'rxjs';
import { MercadoPagoService } from '../../../services/external/mercado-pago.service';
import { Address } from '../../../interfaces/address';
import { AddressesService } from '../../../services/clients/adresses.service';
import { AuthService } from '../../../services/auth/auth.service';
import { AddressFormComponent } from '../../../components/address-form/address-form.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [AddressFormComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  productsToBuy: { idProduct: string, quantity: number }[] = [];
  detailedProducts: any[] = [];
  selectedOption: number = 1;
  shippingCost: number = 0;
  subtotal: number = 0;
  total: number = 0;

  clientAddresses: Address[] = []
  addressesLimit: boolean = false
  openAddressForm: boolean = false
  selectedAddress: number = 0

  checkoutUrl?: string
  
  constructor(
    private route: ActivatedRoute,
    private productsService: ApiProductsService,
    private mpService: MercadoPagoService,
    private addressesService: AddressesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['products']) {
        try {
          this.productsToBuy = JSON.parse(decodeURIComponent(params['products']));
          this.fetchProductDetails();
        } catch (e) {
          console.error('Error parsing products:', e);
        }
      }
    });
    const idClient = this.authService.getUserId()
    this.addressesService.getAddressesByClient(idClient!).subscribe({
      next: (addresses) => {
        this.clientAddresses = addresses
      },
      error: console.error
    })

  }

  fetchProductDetails(): void {
    const productIds = this.productsToBuy.map(p => p.idProduct);
    const productObservables = productIds.map(id => this.productsService.getProductById(id));

    forkJoin(productObservables).subscribe({
      next: products => {
        this.detailedProducts = products.map((product, index) => ({
          ...product,
          quantity: this.productsToBuy[index].quantity
        }));
        this.calculateTotals();
        console.log(this.detailedProducts)
      },
      error: err => console.error('Error fetching product details:', err)
    });
  }

  onClickPay() {
    this.redirectMercadoPago(this.detailedProducts)
  }

  redirectMercadoPago(products: Product[]) {
    console.log(products)
    const addressParam = this.selectedOption === 1 ? null : this.clientAddresses[this.selectedAddress].id!
    this.mpService.goToPay(products, this.shippingCost, addressParam).subscribe({
      next: (response) => {
        this.checkoutUrl = response.init_point
        console.log(response)
        window.location.href = this.checkoutUrl
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  calculateTotals(): void {
    this.subtotal = this.detailedProducts.reduce((acc: number, product: any) => acc + product.price * product.quantity, 0);
    this.total = this.subtotal + this.shippingCost;
  }

  selectOption(option: number): void {
    this.selectedOption = option;
    if(option === 1) this.shippingCost = 0 //Sucursal
    if(option === 2) this.shippingCost = 1000 //Andreani
    this.calculateTotals()
  }

  onClickAddAddress(){
    if(this.clientAddresses?.length === 3) {
      this.addressesLimit = true
      return
    }
    this.openAddressForm = true
  }

  selectAddress(addressNumber: number) {
    this.selectedAddress = addressNumber;
  }

  addAddress(newAddress: Address) {
    this.openAddressForm = false
    this.clientAddresses?.push(newAddress)
  }
}
