export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

export interface Dealer {
  id: string;
  name: string;
  lid: string;
  loc: string;
  route: string;
  addr: string;
  mamt: number;
  orders: number;
  credit: number;
  outstanding: number;
  bg: string;
  ini: string;
}

export interface BulkTier {
  lbl: string;
  min: number;
  disc: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  type: string;
  hsn: string;
  icon: string;
  bg: string;
  col: string;
  price: number;
  mrp: number;
  gst: number;
  qty: number;
  min: number;
  unit: string;
  category: string;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
  gst: number;
  total: number;
}

export interface Order {
  id: string;
  did: string;
  dealer: string;
  loc: string;
  route: string;
  status: OrderStatus;
  items: OrderItem[];
  sub: number;
  gstAmt: number;
  grand: number;
  date: string;
  time: string;
  vehicle: string;
  driver: string;
  inv: string;
  paid: boolean;
  pay: string;
}

export interface Scheme {
  title: string;
  tag: string;
  badge: string;
  desc: string;
  saving: string;
  icon: string;
  bg: string;
  bc: string;
  brd: string;
}

export interface FleetVehicle {
  reg: string;
  driver: string;
  route: string;
  loc: string;
  status: string;
  pct: number;
  orders: number;
  cap: number;
}

export interface DealerNet {
  name: string;
  loc: string;
  route: string;
  ini: string;
  bg: string;
  orders: number;
  mamt: number;
  outstanding: number;
  status: string;
}

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  PlaceOrder: undefined;
  OrderDetail: { orderId: string };
  InvoiceView: { orderId: string };
  Schemes: undefined;
  Payments: undefined;
  Catalog: undefined;
  Notifications: undefined;
};
