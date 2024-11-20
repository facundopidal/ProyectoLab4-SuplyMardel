export interface Sale {
    id:string;
    id_client:string;
    date: string;
    amount:number;
    shipmentStatus: "A retirar" | "Pendiente de ingreso" | "Ingresado" | "En camino" | "Entregado";
    shipmentMethod: string;
    shippingAddressId?: string; //id del domicilio
    shippingNumber?: string;
    paymentStatus: "approved" | "rejected";
    isCancelled: boolean;
    id_merchant_order: string;
}
