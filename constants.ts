import { MenuItem, ProductCategory, Table, TableStatus, Order, OrderStatus, OrderType, Reservation, Driver } from "./types";

export const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Burger',
    description: 'Juicy beef patty topped with truffle oil, swiss cheese, and caramelized onions.',
    price: 18.50,
    category: ProductCategory.MAIN,
    imageUrl: 'https://picsum.photos/id/1080/400/300',
    available: true,
    ingredients: 'Beef patty, Truffle oil, Swiss cheese, Onions, Brioche bun'
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and classic Caesar dressing.',
    price: 12.00,
    category: ProductCategory.APPETIZER,
    imageUrl: 'https://picsum.photos/id/1060/400/300',
    available: true
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'San Marzano tomato sauce, fresh mozzarella di bufala, basil, and extra virgin olive oil.',
    price: 16.00,
    category: ProductCategory.MAIN,
    imageUrl: 'https://picsum.photos/id/1025/400/300',
    available: true
  },
  {
    id: '4',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
    price: 9.50,
    category: ProductCategory.DESSERT,
    imageUrl: 'https://picsum.photos/id/1062/400/300',
    available: true
  },
  {
    id: '5',
    name: 'Craft Lemonade',
    description: 'House-made sparkling lemonade with a hint of mint.',
    price: 5.00,
    category: ProductCategory.DRINK,
    imageUrl: 'https://picsum.photos/id/1011/400/300',
    available: true
  },
   {
    id: '6',
    name: 'Spicy Tuna Roll',
    description: 'Fresh tuna with spicy mayo and cucumber.',
    price: 14.00,
    category: ProductCategory.MAIN,
    imageUrl: 'https://picsum.photos/id/1070/400/300',
    available: true
  },
  {
    id: '7',
    name: 'Glazed Salmon',
    description: 'Pan-seared salmon with a honey garlic glaze.',
    price: 22.00,
    category: ProductCategory.MAIN,
    imageUrl: 'https://picsum.photos/id/1084/400/300',
    available: false
  }
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `T-${i + 1}`,
  capacity: i % 4 === 0 ? 6 : (i % 3 === 0 ? 2 : 4),
  status: i === 2 || i === 5 ? TableStatus.OCCUPIED : (i === 8 ? TableStatus.RESERVED : TableStatus.AVAILABLE),
  currentOrderId: i === 2 ? 'order-101' : (i === 5 ? 'order-102' : undefined)
}));

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    customerName: 'Sarah Connor',
    pax: 4,
    date: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    status: 'CONFIRMED',
    tableId: 8,
    phone: '555-0123'
  },
  {
    id: 'res-2',
    customerName: 'John Wick',
    pax: 2,
    date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    status: 'PENDING',
    notes: 'Requires high chair',
    phone: '555-9876'
  },
  {
    id: 'res-3',
    customerName: 'Tony Stark',
    pax: 8,
    date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: 'COMPLETED',
    phone: '555-5555'
  }
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Mike Ross', status: 'AVAILABLE', activeOrders: 0, phone: '555-1111' },
  { id: 'd2', name: 'Harvey Specter', status: 'BUSY', activeOrders: 2, phone: '555-2222' },
  { id: 'd3', name: 'Donna Paulsen', status: 'OFFLINE', activeOrders: 0, phone: '555-3333' }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-101',
    type: OrderType.DINE_IN,
    tableId: 3,
    items: [
      { menuItemId: '1', name: 'Truffle Burger', price: 18.50, quantity: 2 },
      { menuItemId: '5', name: 'Craft Lemonade', price: 5.00, quantity: 2 }
    ],
    status: OrderStatus.SERVED,
    timestamp: new Date(Date.now() - 1000 * 60 * 45), 
    totalAmount: 47.00
  },
  {
    id: 'ORD-102',
    type: OrderType.DINE_IN,
    tableId: 6,
    items: [
      { menuItemId: '3', name: 'Margherita Pizza', price: 16.00, quantity: 1 },
      { menuItemId: '2', name: 'Caesar Salad', price: 12.00, quantity: 1 }
    ],
    status: OrderStatus.COOKING,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), 
    totalAmount: 28.00,
    note: 'Extra crispy pizza crust'
  },
  {
    id: 'ORD-103',
    type: OrderType.DELIVERY,
    customerName: 'Alice Smith',
    deliveryAddress: '123 Main St, Apt 4B',
    driverId: 'd2',
    items: [
      { menuItemId: '6', name: 'Spicy Tuna Roll', price: 14.00, quantity: 3 }
    ],
    status: OrderStatus.COOKING,
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    totalAmount: 42.00
  },
  {
    id: 'ORD-104',
    type: OrderType.PICKUP,
    customerName: 'Bob Builder',
    pickupCode: 'P-9988',
    items: [
      { menuItemId: '1', name: 'Truffle Burger', price: 18.50, quantity: 1 }
    ],
    status: OrderStatus.READY,
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    totalAmount: 18.50
  },
  {
    id: 'ORD-105',
    type: OrderType.DELIVERY,
    customerName: 'Charlie Day',
    deliveryAddress: '456 Pub Lane',
    items: [
      { menuItemId: '3', name: 'Margherita Pizza', price: 16.00, quantity: 5 }
    ],
    status: OrderStatus.PENDING,
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    totalAmount: 80.00
  }
];
