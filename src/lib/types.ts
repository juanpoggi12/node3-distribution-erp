export type PriceList = "minorista" | "mayorista" | "especial";

export type CustomerStatus = "activo" | "pausado" | "moroso";

export type Customer = {
  id: string;
  code?: string;
  businessName: string;
  contactName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  province?: string;
  zone: string;
  customerType: string;
  priceList: PriceList;
  creditLimit: number;
  currentDebt: number;
  status: CustomerStatus;
  notes: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  stock: number;
  minStock: number;
  prices: Record<PriceList, number>;
  active: boolean;
  allowsDecimals?: boolean;
};

export type InquiryStatus =
  | "nueva"
  | "respondida"
  | "cotizada"
  | "seguimiento"
  | "convertida"
  | "perdida";

export type InquiryChannel = "WhatsApp" | "Instagram" | "Telefono" | "Web" | "Referido";

export type Inquiry = {
  id: string;
  customerId?: string;
  prospectName: string;
  channel: InquiryChannel;
  text: string;
  productHints: string[];
  status: InquiryStatus;
  owner: string;
  nextAction: string;
  followUpDate: string;
  createdAt: string;
  lostReason?: string;
  convertedOrderId?: string;
};

export type OrderStatus =
  | "borrador"
  | "confirmado"
  | "preparacion"
  | "preparado"
  | "cargado"
  | "reparto"
  | "entregado"
  | "entregado_sin_cobrar"
  | "pagado"
  | "cancelado";

export type OrderLine = {
  productId: string;
  quantity: number;
  packages?: number;
  unitPrice: number;
};

export type PaymentMethod = "Efectivo" | "Transferencia" | "Mercado Pago" | "Cheque";

export type Payment = {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference?: string;
};

export type Order = {
  id: string;
  number: string;
  customerId: string;
  inquiryId?: string;
  status: OrderStatus;
  lines: OrderLine[];
  discount: number;
  createdAt: string;
  dueDate: string;
  deliveryZone: string;
  dispatchTruck?: string;
  owner: string;
  notes: string;
  saleCondition?: string;
  seller?: string;
  externalReference?: string;
  paidAmount: number;
  payments?: Payment[];
};

export type DemoState = {
  customers: Customer[];
  products: Product[];
  inquiries: Inquiry[];
  orders: Order[];
};

export type ViewKey =
  | "inicio"
  | "pedidos"
  | "preparacion"
  | "nuevo-pedido"
  | "clientes"
  | "productos"
  | "cobrar"
  | "consultas";

export type NewOrderDraft = {
  customerId: string;
  inquiryId?: string;
  lines: OrderLine[];
  notes: string;
  deliveryZone: string;
  dispatchTruck: string;
  saleCondition?: string;
  seller?: string;
};

export type OrderDocumentType = "nota" | "preparacion";
