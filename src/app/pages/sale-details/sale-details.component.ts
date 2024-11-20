import { Component, OnInit } from '@angular/core';
import { Sale } from '../../interfaces/sale';
import { Product } from '../../interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../services/ecommerce/sales.service';
import { ApiProductsService } from '../../services/ecommerce/api-products.service';
import { salesxProducts } from '../../interfaces/salesxProducts';
import { forkJoin, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { MailSenderService } from '../../services/external/mail-sender.service';
import { ClientsService } from '../../services/clients/clients.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../admin/menu/menu.component';

@Component({
  selector: 'app-sale-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.css'
})
export class SaleDetailsComponent implements OnInit {
  sale!: Sale;
  saleProducts: any[] = [];
  productsSale: salesxProducts[] = [];
  productsName: string = ''
  
  constructor(
    private route: ActivatedRoute,
    private saleService: SalesService,
    private productsService: ApiProductsService,
    private authService: AuthService,
    private ms: MailSenderService,
    private clientsService: ClientsService
  ) { }

  isAdmin: boolean = true

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin()
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.saleService.getSaleBySaleId(id!).subscribe({
        next: (sale) => {
          this.sale = sale;
          this.newShipmentStatus = sale.shipmentStatus
        },
        error: (error) => {
          console.error(error)
        }
      })
      ///cargo los productos por cada venta
      // Primero obtenemos los salesxProducts para esta venta
      this.saleService.getProductsBySalesID(id).pipe(
        // Luego hacemos una llamada a `productService.getProductById()` para cada idProduct
        switchMap((salesxProducts: salesxProducts[]) => {
          this.productsSale = salesxProducts;

          // Creamos un array de observables que llaman a `getProductById()` para cada `idProduct`
          const productRequests = salesxProducts.map(saleProduct =>
            this.productsService.getProductById(saleProduct.idProduct)
          );

          // Ejecutamos todas las solicitudes en paralelo con `forkJoin`
          return forkJoin(productRequests);
        })
      ).subscribe({
        next: (products: Product[]) => {
          this.saleProducts = products; // Guardamos el resultado en el array de productos
          this.saleProducts = this.saleProducts.map((product, index) => {
            return { ...product, quantity: this.productsSale[index].quantity }
          })
          products.forEach(product => {
            this.productsName += product.name + '\n'
          })
        },
        error: (error) => {
          console.error('Error al obtener los productos:', error);
        }
      });
    }
  }

  showModalE = false;
  newShippingNumber: string = '';
  newShipmentStatus: "A retirar" | "Pendiente de ingreso" | "Ingresado" | "En camino" | "Entregado" = "A retirar";

  openEditModal() {
    this.newShippingNumber = this.sale.shippingNumber!
    this.showModalE = true;
  }

  closeEditModal() {
    this.showModalE = false;
  }

  updateShipment() {
    this.saleService.updateSale(this.sale.id, {shipmentStatus: this.newShipmentStatus, shippingNumber: this.newShippingNumber}).subscribe()
    this.sale.shippingNumber = this.newShippingNumber || this.sale.shippingNumber;
    this.sale.shipmentStatus = this.newShipmentStatus;
    this.clientsService.getClientById(this.sale.id_client).subscribe({
      next: (client) => {
        const mailMessage = "Su pedido esta " + this.sale.shipmentStatus.toLowerCase() + "!\n" +
          (this.sale.shippingNumber !== "Pendiente" ? "Su codigo de seguimiento de Andreani es " + this.sale.shippingNumber: 
          "En breve se le enviara su código de seguimiento");

        this.ms.sendMailToUser(
          client.email,
          "Actualización de estado de compra " + this.sale.id,
          mailMessage
        ).subscribe()
      }
    })
    this.closeEditModal();
  }

  stepCompleted(step: string): boolean {
    const steps = ['Pendiente de ingreso', 'Ingresado', 'En camino', 'Entregado'];
    const currentStepIndex = steps.indexOf(this.sale.shipmentStatus);
    return steps.indexOf(step) <= currentStepIndex;
  }

  showModal = false;
  saleToCancel: string | null = null;
  
  openConfirmationModal(saleId: string): void {
    this.saleToCancel = saleId;
    this.showModal = true;
  }
  
  confirmCancel(): void {
    if (this.saleToCancel !== null) {
      this.saleService.cancelSale(this.saleToCancel)
      this.saleToCancel = null;
      this.sale.isCancelled = true
    }
    this.showModalE = false;
  
    this.clientsService.getClientById(this.sale.id_client).subscribe({
      next: (client) => {
        ///mail al user
        this.ms.sendMailToUser(
          client.email,
          "Cancelación de compra",
          "El administrador canceló tu compra con Id: " +  this.sale.id + " realizada el"+ this.sale.date +", en la brevedad se contactará contigo para tramitar la devolución del dinero"
        ).subscribe({
          next: (res) => {
            console.log(res)
          },
          error: (e) => {
            console.error(e)
          }
        })
        ///mail al admin
        this.ms.sendMailToAdmin(
          "Cancelaste la compra: " + this.sale.id,
          "La compra consiste en: " + this.productsName, client.email
        ).subscribe({
          next: (res) => {
            console.log(res)
          },
          error: (e) => {
            console.error(e)
          }
        })
      }
    })
    
  }
  
  cancelCancel(): void {
    this.saleToCancel = null;
    this.showModal = false;
  }


  
}









