export type UserRole = 'customer' | 'owner';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export type ConditionGrade = 'Grade A+' | 'Grade A' | 'Grade B';

export type ProductCategory = 
  | 'laptops' 
  | 'desktops' 
  | 'monitors' 
  | 'components' 
  | 'accessories' 
  | 'networking';

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  conditionGrade: ConditionGrade;
  price: number;
  mrp: number;
  discountPercent: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  warranty: string;
  shortSpecs: string[];
  specs: Record<string, string>;
  description: string;
  conditionSummary: string;
  isDailyDeal?: boolean;
  isFeatured?: boolean;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ServiceMode = 'home_visit' | 'shop_dropoff';

export type ServiceStatus = 
  | 'Received' 
  | 'Technician Assigned' 
  | 'Diagnosing' 
  | 'Awaiting Parts' 
  | 'Repair Complete' 
  | 'Ready for Delivery' 
  | 'Completed' 
  | 'Cancelled';

export interface ServiceBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  city: string;
  deviceType: 'Laptop' | 'Desktop PC' | 'Monitor' | 'Printer / Accessory' | 'Other';
  deviceBrandModel: string;
  issueCategory: string;
  issueDescription: string;
  serviceMode: ServiceMode;
  scheduledDate: string;
  timeSlot: string;
  status: ServiceStatus;
  estimatedCost: number;
  finalCost?: number;
  technicianName?: string;
  technicianNotes?: string;
  createdAt: string;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  conditionGrade: ConditionGrade;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'UPI / Online' | 'Cash on Delivery (COD)' | 'Card';
  paymentStatus: 'Paid' | 'Pending (COD)';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
}

export interface RepairServiceInfo {
  id: string;
  title: string;
  category: string;
  icon: string;
  startingPrice: number;
  turnaroundTime: string;
  homeVisitEligible: boolean;
  description: string;
  commonIssues: string[];
}

export interface ShopSettings {
  storeName: string;
  ownerName: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  streetDetails: string;
  locationDetails: string;
  city: string;
  state: string;
  pincode: string;
  timings: string;
  upiId: string;
  announcement: string;
  serviceAreas: string[];
}
