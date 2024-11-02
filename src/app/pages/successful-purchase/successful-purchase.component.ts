import { Component, OnInit } from '@angular/core';
import confetti from 'canvas-confetti';
@Component({
  selector: 'app-successful-purchase',
  standalone: true,
  imports: [],
  templateUrl: './successful-purchase.component.html',
  styleUrl: './successful-purchase.component.css'
})
export class SuccessfulPurchaseComponent implements OnInit {

  ngOnInit(): void {

    this.ejectCucumbers()

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
