export interface Sale {
    id:string;
    id_client:string;
    date: string;
    amount:number;
    shipmentStatus: string;
    shipmentMethod: string;
    shippingAdress?: string; //id del domicilio
    paymentStatus: "approved" | "rejected";
    isCancelled: boolean;
    id_merchant_order: number;
}
