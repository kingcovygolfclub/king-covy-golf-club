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

// Excel Inventory Tracker Types
export interface InventoryItem {
  itemId: string; // Unique identifier
  brand: string;
  model: string;
  clubType: ProductCategory;
  condition: ProductCondition;
  customization?: string;
  purchaseCost: number;
  customizationCost?: number;
  totalCost: number; // Purchase + Customization
  soldPrice?: number;
  saleDate?: string;
  shippingCost?: number;
  netRevenue?: number; // Sold Price - Total Cost - Shipping
  profitMargin?: number; // Net Revenue ÷ Total Cost
  status: 'inventory' | 'sold' | 'pending';
  binLocation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Metrics based on Excel requirements
export interface DashboardMetrics {
  totalItemsLogged: number;
  itemsSold: number;
  itemsInInventory: number;
  inventoryCostValue: number; // Unsold items cost value
  inventoryListedValue: number; // Unsold items listed value
  totalRevenue: number;
  totalCOGS: number; // Cost of Goods Sold
  totalShipping: number;
  totalNetProfit: number;
  averageProfitMargin: number; // Average for sold items
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
}

// Invoice and Pick Slip Types
export interface InvoiceItem {
  itemId: string;
  brand: string;
  model: string;
  clubType: string;
  condition: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  netRevenue: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  date: string;
  status: 'draft' | 'sent' | 'paid';
}

export interface PickSlipItem {
  itemId: string;
  brand: string;
  model: string;
  clubType: string;
  binLocation?: string;
  notes?: string;
  quantity: number;
}

export interface PickSlip {
  id: string;
  orderId: string;
  items: PickSlipItem[];
  date: string;
  status: 'pending' | 'picked' | 'shipped';
  notes?: string;
}
