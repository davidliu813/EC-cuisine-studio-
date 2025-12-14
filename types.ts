
export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  DIRTY = 'DIRTY'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COOKING = 'COOKING',
  READY = 'READY',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP'
}

export enum ProductCategory {
  APPETIZER = 'APPETIZER',
  MAIN = 'MAIN',
  DESSERT = 'DESSERT',
  DRINK = 'DRINK'
}

export interface ImageFilter {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  filterName: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Changed from enum to string to support custom categories
  imageUrl: string;
  available: boolean;
  ingredients?: string;
  imageFilter?: ImageFilter;
  audioUrl?: string; // For TTS description
  musicVibe?: string; // For background music theme
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  type: OrderType;
  tableId?: number; // For Dine In
  customerName?: string;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: Date;
  totalAmount: number;
  note?: string;
  deliveryAddress?: string;
  driverId?: string;
  pickupCode?: string;
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  pax: number;
  date: Date;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  tableId?: number;
  notes?: string;
  phone: string;
}

export interface Driver {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  activeOrders: number;
  phone: string;
}

export interface SalesData {
  time: string;
  amount: number;
}
