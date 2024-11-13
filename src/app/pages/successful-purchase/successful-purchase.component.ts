import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import confetti from 'canvas-confetti';
import { SalesService } from '../../services/ecommerce/sales.service';
import { Client } from '../../interfaces/client';
import { AuthService } from '../../services/auth/auth.service';
import { ClientsService } from '../../services/clients/clients.service';
import { MercadoPagoService } from '../../services/external/mercado-pago.service';
@Component({
  selector: 'app-successful-purchase',
  standalone: true,
  imports: [],
  templateUrl: './successful-purchase.component.html',
  styleUrl: './successful-purchase.component.css'
})
export class SuccessfulPurchaseComponent implements OnInit {
  // Definir las propiedades para los parámetros de la URL
  collectionId!: string;
  collectionStatus!: string;
  paymentId!: string;
  status!: string;
  externalReference!: string;
  paymentType!: string;
  merchantOrderId!: string;
  preferenceId!: string;
  siteId!: string;
  processingMode!: string;
  merchantAccountId!: string;

  client?: Client
  detailedProducts: any;
  subtotal: any;
  shippingCost: any;
  total: any;

  constructor(private route: ActivatedRoute, private salesServ: SalesService, 
    private authServ: AuthService, private clientServ: ClientsService, private mpServ: MercadoPagoService) { }

  ngOnInit(): void {
    const id = this.authServ.getUserId()
    
    this.clientServ.getClientById(id!).subscribe({
      next: (client) => {
        this.client = client
      }
    })
    // Obtener todos los parámetros de la URL
    this.route.queryParams.subscribe(params => {

      this.status = params['status'];
      this.merchantOrderId = params['merchant_order_id'];
      this.preferenceId = params['preference_id'];

      // Ahora puedes utilizar estos valores para las operaciones necesarias
      this.handlePurchase();
      this.ejectCucumbers()
    });
  }

  handlePurchase(): void {
    this.mpServ.getOrderData(parseInt(this.merchantOrderId)).subscribe({
      next: (res) => {
        console.log(res)
        const formattedDate = this.formatDate(res.last_updated);
        //this.salesServ.createSale(this.client.id!, )
      }
    })
    
    

    // Aquí puedes implementar la lógica para borrar el carrito, actualizar el stock, crear la venta, etc.
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
