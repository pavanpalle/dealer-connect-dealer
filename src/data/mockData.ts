import { Dealer, Product, BulkTier, Order, Scheme } from '../types';

export const DEALERS: Record<string, Dealer> = {
  d1: {
    id: 'd1', name: 'Ramesh Stores', lid: 'RS-HYD-0001', loc: 'Ameerpet',
    route: 'Route A', addr: '12-1-45, Main Road, Ameerpet\nHyderabad, Telangana 500016',
    mamt: 82400, orders: 64, credit: 50000, outstanding: 0,
    bg: 'linear-gradient(135deg,#F59E0B,#FCD34D)', ini: 'RS',
  },
  d2: {
    id: 'd2', name: 'Lakshmi Kirana', lid: 'LK-HYD-0002', loc: 'Kukatpally',
    route: 'Route B', addr: '8-3-22, KPHB Colony, Kukatpally\nHyderabad, Telangana 500072',
    mamt: 56200, orders: 42, credit: 40000, outstanding: 6300,
    bg: 'linear-gradient(135deg,#0EA5E9,#38BDF8)', ini: 'LK',
  },
  d3: {
    id: 'd3', name: 'Sri Balaji Mart', lid: 'SB-HYD-0003', loc: 'Madhapur',
    route: 'Route A', addr: '5-9-88, Hitech City Road, Madhapur\nHyderabad, Telangana 500081',
    mamt: 71800, orders: 55, credit: 60000, outstanding: 0,
    bg: 'linear-gradient(135deg,#8B5CF6,#A78BFA)', ini: 'SB',
  },
};

export const DEALER_COLORS: Record<string, string> = {
  d1: '#F59E0B',
  d2: '#0EA5E9',
  d3: '#8B5CF6',
};

export const PRODUCTS: Product[] = [
  { id: 'nm500', name: 'Nandini Milk 500ml', sku: 'NM-500-PCK', type: 'Toned Milk', hsn: '0401', icon: 'milk', bg: '#EBF0FF', col: '#1A56DB', price: 25, mrp: 27, gst: 5, qty: 840, min: 100, unit: 'packs', category: 'milk' },
  { id: 'nm1l', name: 'Nandini Milk 1L', sku: 'NM-1000-PCK', type: 'Full Cream', hsn: '0401', icon: 'milk', bg: '#E6F5F0', col: '#0B7B5E', price: 48, mrp: 52, gst: 5, qty: 620, min: 100, unit: 'packs', category: 'milk' },
  { id: 'ng500', name: 'Nandini Ghee 500ml', sku: 'NG-500-BTL', type: 'Pure Ghee', hsn: '0405', icon: 'ghee', bg: '#FEF3C7', col: '#B45309', price: 280, mrp: 310, gst: 12, qty: 240, min: 50, unit: 'bottles', category: 'dairy' },
  { id: 'nc400', name: 'Nandini Curd 400g', sku: 'NC-400-CUP', type: 'Set Curd', hsn: '0403', icon: 'curd', bg: '#F3E8FF', col: '#7C3AED', price: 30, mrp: 35, gst: 5, qty: 520, min: 100, unit: 'cups', category: 'dairy' },
  { id: 'nb100', name: 'Nandini Butter 100g', sku: 'NB-100-PCK', type: 'Salted', hsn: '0405', icon: 'butter', bg: '#FEF3C7', col: '#B45309', price: 52, mrp: 56, gst: 12, qty: 380, min: 80, unit: 'packs', category: 'dairy' },
  { id: 'fm200', name: 'Flavored Milk 200ml', sku: 'FM-200-BTL', type: 'Badam', hsn: '0401', icon: 'drink', bg: '#FEE9E7', col: '#C0392B', price: 20, mrp: 25, gst: 12, qty: 148, min: 100, unit: 'bottles', category: 'drinks' },
];

export const BULK_TIERS: Record<string, BulkTier[]> = {
  nm500: [{ lbl: 'Single', min: 1, disc: 0 }, { lbl: 'Half Case', min: 12, disc: 3 }, { lbl: 'Full Case', min: 24, disc: 6 }, { lbl: 'Bulk', min: 48, disc: 10 }],
  nm1l:  [{ lbl: 'Single', min: 1, disc: 0 }, { lbl: 'Half Case', min: 10, disc: 3 }, { lbl: 'Full Case', min: 20, disc: 6 }, { lbl: 'Bulk', min: 40, disc: 10 }],
  ng500: [{ lbl: 'Single', min: 1, disc: 0 }, { lbl: 'Half Case', min: 6, disc: 4 }, { lbl: 'Full Case', min: 12, disc: 7 }, { lbl: 'Bulk', min: 24, disc: 11 }],
  nc400: [{ lbl: 'Single', min: 1, disc: 0 }, { lbl: 'Half Case', min: 12, disc: 3 }, { lbl: 'Full Case', min: 24, disc: 5 }, { lbl: 'Bulk', min: 48, disc: 8 }],
  nb100: [{ lbl: 'Single', min: 1, disc: 0 }, { lbl: 'Half Case', min: 10, disc: 4 }, { lbl: 'Full Case', min: 20, disc: 7 }, { lbl: 'Bulk', min: 40, disc: 12 }],
  fm200: [{ lbl: 'Single', min: 1, disc: 0 }, { lbl: 'Half Case', min: 12, disc: 5 }, { lbl: 'Full Case', min: 24, disc: 8 }, { lbl: 'Bulk', min: 48, disc: 12 }],
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-4821', did: 'd1', dealer: 'Ramesh Stores', loc: 'Ameerpet', route: 'Route A',
    status: 'delivered',
    items: [
      { id: 'nm500', name: 'Nandini Milk 500ml', sku: 'NM-500-PCK', qty: 48, price: 22.50, gst: 5, total: 1080 },
      { id: 'ng500', name: 'Nandini Ghee 500ml', sku: 'NG-500-BTL', qty: 12, price: 260.40, gst: 12, total: 3124.80 },
    ],
    sub: 4204.80, gstAmt: 429, grand: 4634, date: '28 Mar', time: '10:30 AM',
    vehicle: 'TG-09-AB-1122', driver: 'Ravi Kumar', inv: 'INV-2026-0821', paid: true, pay: 'UPI',
  },
  {
    id: 'ORD-4820', did: 'd2', dealer: 'Lakshmi Kirana', loc: 'Kukatpally', route: 'Route B',
    status: 'processing',
    items: [
      { id: 'nm1l', name: 'Nandini Milk 1L', sku: 'NM-1000-PCK', qty: 20, price: 45.12, gst: 5, total: 902.40 },
      { id: 'nc400', name: 'Nandini Curd 400g', sku: 'NC-400-CUP', qty: 24, price: 28.50, gst: 5, total: 684 },
    ],
    sub: 1586.40, gstAmt: 79, grand: 1666, date: '29 Mar', time: '2:15 PM',
    vehicle: 'TG-09-AB-1122', driver: '', inv: 'INV-2026-0820', paid: false, pay: '',
  },
  {
    id: 'ORD-4819', did: 'd3', dealer: 'Sri Balaji Mart', loc: 'Madhapur', route: 'Route A',
    status: 'delivered',
    items: [
      { id: 'nb100', name: 'Nandini Butter 100g', sku: 'NB-100-PCK', qty: 40, price: 45.76, gst: 12, total: 1830.40 },
      { id: 'fm200', name: 'Flavored Milk 200ml', sku: 'FM-200-BTL', qty: 48, price: 17.60, gst: 12, total: 844.80 },
    ],
    sub: 2675.20, gstAmt: 321, grand: 2996, date: '27 Mar', time: '9:00 AM',
    vehicle: 'TG-11-CD-3344', driver: 'Suresh B', inv: 'INV-2026-0819', paid: true, pay: 'NEFT',
  },
  {
    id: 'ORD-4818', did: 'd1', dealer: 'Ramesh Stores', loc: 'Ameerpet', route: 'Route A',
    status: 'pending',
    items: [
      { id: 'nm500', name: 'Nandini Milk 500ml', sku: 'NM-500-PCK', qty: 24, price: 23.50, gst: 5, total: 564 },
    ],
    sub: 564, gstAmt: 28, grand: 592, date: '30 Mar', time: '4:45 PM',
    vehicle: '', driver: '', inv: 'INV-2026-0818', paid: false, pay: '',
  },
];

export const SCHEMES: Scheme[] = [
  {
    title: 'Mega Milk Week', tag: 'Active \u00b7 Ends 5 Apr', badge: 'Up to 15%',
    desc: 'Order 48+ packs of Nandini Milk (500ml or 1L) and get an extra 5% off on top of bulk pricing. Valid on all milk variants.',
    saving: '\u20b92-5 per pack', icon: 'milk', bg: '#EBF0FF', bc: '#1A56DB', brd: '#C7D7FF',
  },
  {
    title: 'Ghee Festival Offer', tag: 'Active \u00b7 Limited Stock', badge: 'Flat 12%',
    desc: 'Flat 12% off on Nandini Ghee 500ml when you order a full case (12+ bottles). Premium quality at best wholesale price.',
    saving: '\u20b933 per bottle', icon: 'ghee', bg: '#FEF3C7', bc: '#B45309', brd: '#FCD34D',
  },
  {
    title: 'Combo Pack Deal', tag: 'Upcoming \u00b7 Starts 10 Apr', badge: '10+2 Free',
    desc: 'Buy any 10 cases of dairy products and get 2 cases of Flavored Milk absolutely free. Mix and match allowed.',
    saving: '\u20b9960 value free', icon: 'combo', bg: '#F3E8FF', bc: '#7C3AED', brd: '#DDD6FE',
  },
  {
    title: 'Early Bird Bonus', tag: 'Upcoming \u00b7 Next Month', badge: 'Extra 3%',
    desc: 'Place your order before 8 AM and get an extra 3% discount on the entire order. Applicable on all products.',
    saving: 'Avg \u20b9150/order', icon: 'clock', bg: '#E6F5F0', bc: '#0B7B5E', brd: '#A7E3D0',
  },
];

export function formatCurrency(amount: number): string {
  return '\u20b9' + Math.round(amount).toLocaleString('en-IN');
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getTier(productId: string, qty: number): BulkTier | null {
  const tiers = BULK_TIERS[productId];
  if (!tiers) return null;
  let result: BulkTier | null = null;
  for (const tier of tiers) {
    if (qty >= tier.min) result = tier;
  }
  return result;
}

export function effPrice(productId: string, qty: number): number {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return 0;
  const tier = getTier(productId, qty);
  if (!tier || tier.disc === 0) return product.price;
  return Math.round(product.price * (100 - tier.disc)) / 100;
}

export function tierColor(disc: number): string {
  if (disc >= 10) return '#7C3AED';
  if (disc >= 6) return '#1A56DB';
  if (disc >= 3) return '#0B7B5E';
  return '#8892A8';
}
