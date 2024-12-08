import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Product } from '../../interfaces/product';
import { Client } from '../../interfaces/client';
import { Sale } from '../../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generateInvoice(data: {client: Client, sale: Sale, products: any[], total: number}) {
    const doc = new jsPDF();

    // Título del comprobante
    doc.setFontSize(16);
    doc.text('Comprobante de Compra: ' + data.sale.id, 10, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${data.sale.date}`, 10, 30);

    doc.line(10, 34, 140, 34)
    doc.text('CUIT: 20217388283', 10, 40)
    doc.text('Apoderado de la empresa: Nestor Quiroga', 10, 48)
    doc.text('Dirección de facturación: Remedios de Escalada 875', 10, 56)
    doc.line(10, 60, 140, 60)

    // Datos del cliente y orden
    doc.text(`Cliente: ${data.client.name + " " + data.client.lastname}`, 10, 68);

    // Tabla de productos
    let y = 86;
    doc.line(10, y - 14, 140, y - 14)
    doc.text('Productos: ', 10, y - 8)
    data.products.forEach((product: any) => {
      doc.text(
        `${product.name} - Cantidad: ${product.quantity} - Precio: $${product.price}`,
        10,
        y
      );
      y += 8;
    });
    doc.line(10, y - 5, 140, y - 5)

    if(data.sale.shipmentMethod === "Andreani") {
      doc.text("Costo de envío: $5200", 10, y + 2)
    }

    // Total
    doc.text(`Total: $${data.total}`, 10, y + 10);

    const image = document.createElement('img')
    image.src = "SuplyMardelLogo.webp"

    doc.addImage({imageData: image, x: 160, y: 5, width: 28, height: 28})
    doc.text("SuplyMardel", 162, 37)
    doc.setDrawColor("002b5c")
    doc.setLineWidth(1)
    doc.line(5, 5, 5, y + 12)

    // Descarga del PDF
    doc.save(`Comprobante-${data.sale.id}-${data.sale.date}-${data.client.name.replaceAll(' ', '')}${data.client.lastname.replaceAll(' ', '')}.pdf`);
  }
}
