import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import confetti from 'canvas-confetti';
import { SalesService } from '../../services/ecommerce/sales.service';
import { Client } from '../../interfaces/client';
import { AuthService } from '../../services/auth/auth.service';
import { ClientsService } from '../../services/clients/clients.service';
import { MercadoPagoService } from '../../services/external/mercado-pago.service';
import { Product } from '../../interfaces/product';
import { Address } from '../../interfaces/address';
import { AddressesService } from '../../services/clients/adresses.service';
import { Sale } from '../../interfaces/sale';
import { MailSenderService } from '../../services/external/mail-sender.service';
import { ApiProductsService } from '../../services/ecommerce/api-products.service';
@Component({
  selector: 'app-successful-purchase',
  standalone: true,
  imports: [],
  templateUrl: './successful-purchase.component.html',
  styleUrl: './successful-purchase.component.css'
})
export class SuccessfulPurchaseComponent implements OnInit {
  // Definir las propiedades para los parámetros de la URL
  status!: string;
  merchantOrderId!: string;
  preferenceId!: string;


  client?: Client
  products: any[] = [];
  subtotal?: any;
  shippingCost?: any;
  total?: any;
  shipmentMethod?: string;
  shipmentStatus?: string;
  formattedDate?: string;
  shippingAddress?: Address
  saleId?: string

  constructor(
    private route: ActivatedRoute, 
    private salesServ: SalesService, 
    private addressServ: AddressesService,
    private authServ: AuthService, 
    private clientServ: ClientsService, 
    private mpServ: MercadoPagoService, 
    private ms: MailSenderService,
    private productsService: ApiProductsService
  ) { }


  ngOnInit(): void {
    const id = this.authServ.getUserId()

    this.clientServ.getClientById(id!).subscribe({
      next: (client) => {
        this.client = client
        console.log(this.client!.email)
        ///mail al user
        
      }
    })

    // Obtener todos los parámetros de la URL
    this.route.queryParams.subscribe(params => {

      this.status = params['status'];
      this.merchantOrderId = params['merchant_order_id'];
      this.preferenceId = params['preference_id'];

      this.handlePurchase(); 
      this.ejectCucumbers()

    });
  }

  handlePurchaseHardcode() {
    console.log(this.merchantOrderId)
    let addressId = "6042"
    this.formattedDate = Date()
    this.salesServ.createSale(this.authServ.getUserId()!, this.formattedDate, "approved", addressId ? "Andreani" : "Retiro en sucursal", 1 + 1000, this.merchantOrderId, addressId || undefined).subscribe({
      next: (sale: Sale) => {
        console.log(sale)
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  handlePurchase(): void {
    console.log(this.merchantOrderId)
    this.mpServ.getOrderData(parseInt(this.merchantOrderId)).subscribe({
      next: (res) => {
        console.log(res)
        this.formattedDate = this.formatDate(Date());
        const addressId = localStorage.getItem("addressId")
        if (addressId) {
          this.addressServ.getAddressById(addressId).subscribe({
            next: (address) => {
              this.shippingAddress = address
              this.shipmentMethod = "Andreani"
              this.shipmentStatus = "En camino"
            }
          })
        }
        this.subtotal = res.total_amount
        this.shippingCost = res.shipping_cost
        this.total = this.subtotal + this.shippingCost

        this.salesServ.createSale(this.client!.id, this.formattedDate, "approved", addressId ? "Andreani" : "Retiro en sucursal", res.total_amount + res.shipping_cost, this.merchantOrderId, addressId || undefined).subscribe({
          next: (sale) => { 

            this.salesServ.getProductsBySalesID(sale.id).subscribe({
              next: (sxpArray) => {
                sxpArray.map(sxp => {
                  this.getProductById(sxp.idProduct, sxp.quantity)
                })
                this.sendEmails()
              }
            })
          }
        })
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  getProductById(idProduct: string, quantity: number) {
    this.productsService.getProductById(idProduct).subscribe({
      next: (product) => {
        this.products.push({...product, quantity: quantity})
      },
      error: console.error
    })
  }

  sendEmails(){
    const productsDetail = this.generatePurchaseDetails(this.shippingCost)
    

    this.ms.sendMailToUser(
      this.client!.email,
      "Confirmacion de compra con ID: " + this.saleId,
      productsDetail
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
      "Confirmacion de compra con ID: " + this.saleId +  ", de: " + this.client!.email,
      productsDetail,
      this.client!.email
    ).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (e) => {
        console.error(e)
      }
    })
  }

  generatePurchaseDetails(shippingCost: number): string {
    let totalAmount = 0;
    let purchaseDetails = "Detalle de la compra:\n\n";
  
    this.products.forEach((product, index) => {
      const subtotal = product.price * product.quantity;
      totalAmount += subtotal;
  
      purchaseDetails += `Producto ${index + 1}:\n`;
      purchaseDetails += `- Nombre: ${product.name}\n`;
      purchaseDetails += `- Marca: ${product.brand}\n`;
      purchaseDetails += `- Categoría: ${product.category}\n`;
      purchaseDetails += `- Sabor: ${product.flavor}\n`;
      purchaseDetails += `- Peso: ${product.weight}g\n`;
      purchaseDetails += `- Precio Unitario: $${product.price.toFixed(2)}\n`;
      purchaseDetails += `- Cantidad: ${product.quantity}\n`;
      purchaseDetails += `- Subtotal: $${subtotal.toFixed(2)}\n\n`;
    });
    totalAmount += shippingCost
    purchaseDetails += `Costo de envío: $${shippingCost}`
    purchaseDetails += `Total de la compra: $${totalAmount.toFixed(2)}\n`;
    return purchaseDetails;
  }


  formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date).replace(',', '');
  }

  ejectCucumbers(): void {
    var scalar = 2;
    var cucumber = confetti.shapeFromText({ text: '🥒', scalar });

    confetti({
      particleCount: 500,
      angle: 60,
      spread: 200,
      origin: { x: 0, y: 0.5 },
      shapes: [cucumber],
      scalar
    }).then(() => {
      console.log('La animación de confetti ha terminado');
    });

    confetti({
      particleCount: 500,
      angle: 120,
      spread: 200,
      origin: { x: 1, y: 0.5 },
      shapes: [cucumber],
      scalar
    }).then(() => {
      console.log('La animación de confetti ha terminado');
    });
    confetti({
      particleCount: 300,
      angle: 90,
      spread: 200,
      origin: { x: 0.5, y: 1 },
      shapes: [cucumber],
      scalar
    }).then(() => {
      console.log('La animación de confetti ha terminado');
    });
    confetti({
      particleCount: 300,
      angle: 260,
      spread: 200,
      origin: { x: 0.5, y: -0.5 },
      shapes: [cucumber],
      scalar
    }).then(() => {
      console.log('La animación de confetti ha terminado');
    });
  }


}
