export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  features?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: 'credit' | 'paypal' | 'mpesa';
} 