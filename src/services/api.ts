const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://8pubh8jl00.execute-api.us-east-1.amazonaws.com/prod';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    lastEvaluatedKey?: any;
  };
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return this.makeRequest<any[]>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/products/${id}`);
  }

  // Order management endpoints
  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrder(orderId: string, customerEmail?: string): Promise<ApiResponse<any>> {
    const queryParams = customerEmail ? `?email=${encodeURIComponent(customerEmail)}` : '';
    return this.makeRequest<any>(`/orders/${orderId}${queryParams}`);
  }

  async getCustomerOrders(customerEmail: string, limit?: number): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams({
      email: customerEmail,
      ...(limit && { limit: limit.toString() })
    });
    return this.makeRequest<any>(`/orders/customer?${queryParams.toString()}`);
  }

  async updateOrderStatus(orderId: string, statusData: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    });
  }

  // Mock data fallback for development
  getMockProducts() {
    return [
      {
        id: 'prod_001',
        name: 'Scotty Cameron Newport 2',
        brand: 'Scotty Cameron',
        category: 'putters',
        price: 399.99,
        originalPrice: 449.99,
        condition: 'excellent',
        stock: 3,
        featured: true,
        description: 'Classic blade putter with milled face for consistent roll',
        images: ['/placeholder-golf-club.jpg'],
        specifications: {
          model: 'Newport 2',
          year: 2023,
          material: 'Stainless Steel',
          finish: 'Stainless Steel',
          length: '34 inches',
          weight: '350g',
          loft: 3,
          lie: 70,
          grip: 'Scotty Cameron Matador'
        },
        customizationOptions: {
          engraving: {
            available: true,
            maxLength: 20,
            locations: ['toe', 'heel', 'bumper']
          },
          grip: {
            available: true,
            options: [
              {
                name: 'Standard Matador',
                id: 'standard',
                price: 0,
                colors: ['black', 'red']
              },
              {
                name: 'Premium Leather',
                id: 'premium',
                price: 25,
                colors: ['brown', 'black']
              }
            ]
          },
          shaft: {
            available: false,
            options: []
          }
        },
        isCustomizable: true,
        tags: ['putter', 'scotty-cameron', 'blade', 'milled', 'premium'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        reviews: [],
        relatedProducts: [],
        faqs: []
      }
    ];
  }
}

export const apiService = new ApiService();
