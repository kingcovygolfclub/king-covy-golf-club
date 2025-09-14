export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  brand: string;
  condition: ProductCondition;
  specifications: ProductSpecifications;
  stock: number;
  isCustomizable: boolean;
  customizationOptions?: CustomizationOptions;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  tags: string[];
  status?: 'active' | 'inactive' | 'deleted';
}

export interface ProductSpecifications {
  model?: string;
  year?: number;
  loft?: number;
  lie?: number;
  shaft?: string;
  grip?: string;
  weight?: string;
  material?: string;
  finish?: string;
  length?: string;
  flex?: string;
}

export interface CustomizationOptions {
  engraving: {
    available: boolean;
    maxLength: number;
    locations: string[];
  };
  grip: {
    available: boolean;
    options: GripOption[];
  };
  shaft: {
    available: boolean;
    options: ShaftOption[];
  };
}

export interface GripOption {
  id: string;
  name: string;
  price: number;
  colors: string[];
}

export interface ShaftOption {
  id: string;
  name: string;
  price: number;
  flex: string;
  weight: string;
}

export type ProductCategory = 
  | 'drivers'
  | 'irons'
  | 'wedges'
  | 'putters'
  | 'fairway-woods'
  | 'hybrids'
  | 'accessories'
  | 'apparel'
  | 'collectibles';

export type ProductCondition = 
  | 'new'
  | 'like-new'
  | 'excellent'
  | 'very-good'
  | 'good'
  | 'fair';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  customizations?: {
    engraving?: string;
    grip?: string;
    shaft?: string;
  };
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentIntentId: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface FilterOptions {
  category?: ProductCategory[];
  brand?: string[];
  condition?: ProductCondition[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
