import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Product } from '../../interfaces/product';
import { Client } from '../../interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generateInvoice(data: {client: Client, date: string, products: any[], total: number}) {
    const doc = new jsPDF();

    // Título del comprobante
    doc.setFontSize(16);
    doc.text('Comprobante de Compra', 10, 20);

    // Datos del cliente y orden
    doc.setFontSize(12);
    doc.text(`Cliente: ${data.client.name + " " + data.client.lastname}`, 10, 30);
    doc.text(`Fecha: ${data.date}`, 10, 40);

    // Tabla de productos
    let y = 60;
    doc.text('Productos: ', 10, y - 8)
    data.products.forEach((product: any) => {
      doc.text(
        `${product.name} - Cantidad: ${product.quantity} - Precio: $${product.price}`,
        10,
        y
      );
      y += 10;
    });

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
    doc.save('comprobante.pdf');
  }
}
