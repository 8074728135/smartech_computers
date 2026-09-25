'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ServiceBooking, OrderStatus, ShopSettings, UserRole, UserProfile } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SERVICES, DEFAULT_SHOP_SETTINGS } from '@/lib/initialData';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  // Shop Settings & Profile
  shopSettings: ShopSettings;
  updateShopSettings: (newSettings: Partial<ShopSettings>) => void;
  resetShopSettings: () => void;

  // Products
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'slug' | 'updatedAt' | 'discountPercent'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  quickUpdatePriceAndStock: (id: string, price: number, stock: number, mrp?: number) => void;
  bulkUpdateProducts: (newProducts: Product[]) => void;
  resetToInitialProducts: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedDiscount: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Service Bookings
  serviceBookings: ServiceBooking[];
  createServiceBooking: (data: Omit<ServiceBooking, 'id' | 'bookingNumber' | 'status' | 'createdAt'>) => ServiceBooking;
  updateServiceBooking: (id: string, updates: Partial<ServiceBooking>) => void;

  // Pincode
  userPincode: string;
  setUserPincode: (pin: string) => void;
  checkDelivery: (pin: string) => { available: boolean; homeServiceAvailable: boolean; message: string };

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Enterprise User Profile & Authentication
  currentUser: UserProfile | null;
  userRole: UserRole;
  isOwnerAuthenticated: boolean;
  loginWithEmail: (email: string, password: string, requiredRole?: UserRole) => { success: boolean; message: string };
  registerUser: (userData: { name: string; email: string; password: string; phone?: string; role: UserRole }) => { success: boolean; message: string };
  logoutUser: () => void;
  requestPasswordReset: (email: string) => { success: boolean; message: string; otp?: string };
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) => { success: boolean; message: string };

  // Auth Modal Controls
  isAuthModalOpen: boolean;
  authModalDefaultRole: UserRole;
  openAuthModal: (role?: UserRole) => void;
  closeAuthModal: () => void;

  // Role Switcher & Legacy Helpers
  setUserRole: (role: UserRole) => void;
  ownerLogin: (pinOrPassword: string) => { success: boolean; message: string };
  ownerLogout: () => void;
  toggleUserRole: () => void;
}

// Single Authorized Owner Definition (Strict 1-Owner Policy)
export const PRIMARY_OWNER_EMAIL = 'azeez@smartechcomputers.com';
export const PRIMARY_OWNER_ID = 'usr-owner-1';
export const PRIMARY_OWNER_NAME = 'Azeez (Smartech Owner)';

export const DEFAULT_ACCOUNTS = [
  {
    id: PRIMARY_OWNER_ID,
    name: PRIMARY_OWNER_NAME,
    email: PRIMARY_OWNER_EMAIL,
    password: 'Password@123',
    phone: '9030400551',
    role: 'owner' as UserRole,
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-cust-1',
    name: 'Hindupur Customer',
    email: 'customer@smartechcomputers.com',
    password: 'Password@123',
    phone: '9949476832',
    role: 'customer' as UserRole,
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [shopSettings, setShopSettings] = useState<ShopSettings>(DEFAULT_SHOP_SETTINGS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(INITIAL_SERVICES);
  const [userPincode, setUserPincode] = useState<string>('515201');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Role-Based Access: Customer vs Owner
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);

  // Enterprise Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userDirectory, setUserDirectory] = useState<{ id: string; name: string; email: string; password: string; phone?: string; role: UserRole; createdAt: string }[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalDefaultRole, setAuthModalDefaultRole] = useState<UserRole>('customer');
  const [resetOtps, setResetOtps] = useState<Record<string, { otp: string; expiresAt: number }>>({});

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      // Initialize or restore User Directory with strict Single-Owner enforcement
      const savedUsers = localStorage.getItem('smartech_users');
      let sanitizedUsers = DEFAULT_ACCOUNTS;
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);
          if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
            // STRICT RULE: Only PRIMARY_OWNER_EMAIL can ever have role 'owner'. Demote any others to 'customer'.
            sanitizedUsers = parsedUsers.map((u: any) => {
              if (u.role === 'owner' && u.email.toLowerCase() !== PRIMARY_OWNER_EMAIL.toLowerCase()) {
                return { ...u, role: 'customer' as UserRole };
              }
              return u;
            });
            // Ensure primary owner exists in the directory
            const hasOwner = sanitizedUsers.some(
              (u: any) => u.email.toLowerCase() === PRIMARY_OWNER_EMAIL.toLowerCase() && u.role === 'owner'
            );
            if (!hasOwner) {
              sanitizedUsers.unshift(DEFAULT_ACCOUNTS[0]);
            }
          }
        } catch {
          sanitizedUsers = DEFAULT_ACCOUNTS;
        }
      }
      setUserDirectory(sanitizedUsers);
      try {
        localStorage.setItem('smartech_users', JSON.stringify(sanitizedUsers));
      } catch {}

      // Restore active user session with strict owner authentication check
      const savedCurrentUser = localStorage.getItem('smartech_current_user');
      if (savedCurrentUser) {
        try {
          const parsedUser: UserProfile = JSON.parse(savedCurrentUser);
          if (parsedUser.role === 'owner') {
            // Only authenticate as owner if email strictly matches PRIMARY_OWNER_EMAIL
            if (parsedUser.email.toLowerCase() === PRIMARY_OWNER_EMAIL.toLowerCase()) {
              setCurrentUser(parsedUser);
              setUserRole('owner');
              setIsOwnerAuthenticated(true);
            } else {
              // Immediately demote unauthorized owner claim
              const demotedUser: UserProfile = { ...parsedUser, role: 'customer' };
              setCurrentUser(demotedUser);
              setUserRole('customer');
              setIsOwnerAuthenticated(false);
              localStorage.setItem('smartech_current_user', JSON.stringify(demotedUser));
              localStorage.removeItem('smartech_owner_auth');
            }
          } else {
            setCurrentUser(parsedUser);
            setUserRole(parsedUser.role || 'customer');
            setIsOwnerAuthenticated(false);
            localStorage.removeItem('smartech_owner_auth');
          }
        } catch {
          setCurrentUser(null);
          setUserRole('customer');
          setIsOwnerAuthenticated(false);
          localStorage.removeItem('smartech_owner_auth');
        }
      } else {
        localStorage.removeItem('smartech_owner_auth');
        setIsOwnerAuthenticated(false);
        setUserRole('customer');
      }

      const savedSettings = localStorage.getItem('smartech_settings');
      if (savedSettings) {
        setShopSettings({ ...DEFAULT_SHOP_SETTINGS, ...JSON.parse(savedSettings) });
      }

      const savedProducts = localStorage.getItem('smartech_products');
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Strip out any previously auto-injected 'prod-paradox' so it matches owner dashboard
            const cleaned = parsed.filter((p: Product) => p.id !== 'prod-paradox');
            const finalProducts = cleaned.length > 0 ? cleaned : INITIAL_PRODUCTS;
            setProducts(finalProducts);
            localStorage.setItem('smartech_products', JSON.stringify(finalProducts));
          } else {
            setProducts(INITIAL_PRODUCTS);
            localStorage.setItem('smartech_products', JSON.stringify(INITIAL_PRODUCTS));
          }
        } catch {
          setProducts(INITIAL_PRODUCTS);
          localStorage.setItem('smartech_products', JSON.stringify(INITIAL_PRODUCTS));
        }
      } else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('smartech_products', JSON.stringify(INITIAL_PRODUCTS));
      }

      const savedCart = localStorage.getItem('smartech_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('smartech_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(INITIAL_ORDERS);
      }

      const savedServices = localStorage.getItem('smartech_services');
      if (savedServices) {
        setServiceBookings(JSON.parse(savedServices));
      } else {
        setServiceBookings(INITIAL_SERVICES);
      }

      const savedPin = localStorage.getItem('smartech_pincode');
      if (savedPin) setUserPincode(savedPin);
    } catch {
      // fallback
    }
    setIsHydrated(true);
  }, []);

  // Listen for storage events across tabs (e.g. changes in /admin immediately sync to /products)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'smartech_products' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setProducts(updated);
          }
        } catch {}
      } else if (e.key === 'smartech_settings' && e.newValue) {
        try {
          setShopSettings(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save changes to localStorage after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('smartech_settings', JSON.stringify(shopSettings));
    } catch {}
  }, [shopSettings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('smartech_products', JSON.stringify(products));
    } catch {}
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('smartech_cart', JSON.stringify(cart));
    } catch {}
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('smartech_orders', JSON.stringify(orders));
    } catch {}
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('smartech_services', JSON.stringify(serviceBookings));
    } catch {}
  }, [serviceBookings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('smartech_pincode', userPincode);
    } catch {}
  }, [userPincode, isHydrated]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Shop Settings
  const updateShopSettings = (newSettings: Partial<ShopSettings>) => {
    setShopSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Shop details updated successfully! Changes are live across the site.', 'success');
  };

  const resetShopSettings = () => {
    setShopSettings(DEFAULT_SHOP_SETTINGS);
    showToast('Shop details reset to verified Smartech Computers info.', 'info');
  };

  // Product actions
  const addProduct = (productData: Omit<Product, 'id' | 'slug' | 'updatedAt' | 'discountPercent'>): Product => {
    const newId = 'prod-' + Date.now().toString(36);
    const slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const discountPercent = productData.mrp > productData.price 
      ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100) 
      : 0;

    const newProduct: Product = {
      ...productData,
      id: newId,
      slug,
      discountPercent,
      updatedAt: new Date().toISOString()
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.title}" to catalog!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const price = updates.price !== undefined ? updates.price : p.price;
        const mrp = updates.mrp !== undefined ? updates.mrp : p.mrp;
        const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
        return {
          ...p,
          ...updates,
          price,
          mrp,
          discountPercent,
          updatedAt: new Date().toISOString()
        };
      })
    );
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const quickUpdatePriceAndStock = (id: string, price: number, stock: number, mrp?: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const finalMrp = mrp !== undefined ? mrp : p.mrp;
        const discountPercent = finalMrp > price ? Math.round(((finalMrp - price) / finalMrp) * 100) : 0;
        return {
          ...p,
          price,
          stock,
          mrp: finalMrp,
          discountPercent,
          updatedAt: new Date().toISOString()
        };
      })
    );
    showToast('Price and stock updated instantly!', 'success');
  };

  const bulkUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    showToast(`Successfully loaded ${newProducts.length} products!`, 'success');
  };

  const resetToInitialProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Catalog reset to official Smartech Computers inventory', 'info');
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Sorry, this product is currently out of stock!', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        showToast(`Updated quantity in cart (${newQty})`, 'success');
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        showToast(`Added ${product.title.slice(0, 30)}... to cart!`, 'success');
        return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setAppliedDiscount(0);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FIRST500' && cartSubtotal >= 5000) {
      setCouponCode(clean);
      setAppliedDiscount(500);
      showToast('Coupon FIRST500 applied! ₹500 flat discount added.', 'success');
      return { success: true, message: '₹500 flat discount applied!' };
    }
    if (clean === 'UPGRADE10' && cartSubtotal >= 1000) {
      const disc = Math.round(cartSubtotal * 0.1);
      setCouponCode(clean);
      setAppliedDiscount(Math.min(disc, 2000));
      showToast(`Coupon UPGRADE10 applied! ₹${Math.min(disc, 2000)} saved.`, 'success');
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'SMARTECH100' && cartSubtotal >= 1000) {
      setCouponCode(clean);
      setAppliedDiscount(100);
      showToast('Smartech Special ₹100 Welcome Discount applied!', 'success');
      return { success: true, message: '₹100 discount applied!' };
    }
    showToast('Invalid coupon. Try SMARTECH100 or UPGRADE10', 'error');
    return { success: false, message: 'Invalid coupon code' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
    showToast('Coupon removed', 'info');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SM-${randomNum}`;
    const id = `ord-${Date.now().toString(36)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      orderStatus: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const orderedItem = orderData.items.find((item) => item.productId === p.id);
        if (orderedItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - orderedItem.quantity)
          };
        }
        return p;
      })
    );

    clearCart();
    showToast(`Order #${orderNumber} placed successfully! Thank you for choosing Smartech Computers.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    showToast(`Order status updated to "${status}"`, 'success');
  };

  // Service Bookings
  const createServiceBooking = (
    data: Omit<ServiceBooking, 'id' | 'bookingNumber' | 'status' | 'createdAt'>
  ): ServiceBooking => {
    const randomNum = Math.floor(5000 + Math.random() * 5000);
    const bookingNumber = `SRV-${randomNum}`;
    const id = `srv-${Date.now().toString(36)}`;

    const newBooking: ServiceBooking = {
      ...data,
      id,
      bookingNumber,
      status: 'Received',
      createdAt: new Date().toISOString()
    };

    setServiceBookings((prev) => [newBooking, ...prev]);
    showToast(`Repair job card #${bookingNumber} created! Bring your device to our RPGT Road shop for inspection.`, 'success');
    return newBooking;
  };

  const updateServiceBooking = (id: string, updates: Partial<ServiceBooking>) => {
    setServiceBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    showToast('Service booking updated!', 'success');
  };

  // Delivery check logic for Hindupur & Surroundings
  const checkDelivery = (pin: string) => {
    const cleaned = pin.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      return {
        available: false,
        homeServiceAvailable: false,
        message: 'Please enter a valid 6-digit PIN code.'
      };
    }
    // Hindupur & Anantapur / Sri Sathya Sai District PIN codes: 515xxx
    if (cleaned.startsWith('515')) {
      return {
        available: true,
        homeServiceAvailable: false,
        message: 'Express 2-Hour Delivery for accessories & In-Shop Workbench Repair in Hindupur!'
      };
    }
    // Bengaluru / Nearby Karnataka PINs: 560xxx, 561xxx, 562xxx
    if (cleaned.startsWith('560') || cleaned.startsWith('561') || cleaned.startsWith('562')) {
      return {
        available: true,
        homeServiceAvailable: false,
        message: 'Next-Day Courier Delivery Available! In-shop repairs at our Hindupur workbench.'
      };
    }
    return {
      available: true,
      homeServiceAvailable: false,
      message: 'All-India Insured Courier Delivery Available (2-4 Days). Repairs are handled at our RPGT Road shop.'
    };
  };

  // Owner Authentication Actions - Restricted strictly to Single Authorized Owner (Azeez)
  const ownerLogin = (pinOrPassword: string): { success: boolean; message: string } => {
    const clean = pinOrPassword.trim();
    const ownerAccount = userDirectory.find(
      u => u.email.toLowerCase() === PRIMARY_OWNER_EMAIL.toLowerCase() && u.role === 'owner'
    ) || DEFAULT_ACCOUNTS[0];

    // Single Owner Credential check: Only accept owner's valid password or master key
    if (clean === ownerAccount.password || clean === 'Password@123' || clean === 'Azeez@Hindupur515201') {
      const profile: UserProfile = {
        id: ownerAccount.id,
        name: ownerAccount.name,
        email: ownerAccount.email,
        phone: ownerAccount.phone,
        role: 'owner',
        createdAt: ownerAccount.createdAt
      };
      setCurrentUser(profile);
      setIsOwnerAuthenticated(true);
      setUserRole('owner');
      try {
        localStorage.setItem('smartech_current_user', JSON.stringify(profile));
        localStorage.setItem('smartech_owner_auth', 'true');
      } catch {}
      showToast('Welcome back, Azeez! Owner Mode enabled with full shop controls.', 'success');
      return { success: true, message: 'Authentication successful' };
    }
    showToast('Access Denied: Invalid Owner credentials. Only the authorized shop owner can sign in.', 'error');
    return { success: false, message: 'Invalid credentials. Only the verified shop owner is authorized.' };
  };

  const ownerLogout = () => {
    setIsOwnerAuthenticated(false);
    setUserRole('customer');
    try {
      localStorage.removeItem('smartech_owner_auth');
    } catch {}
    showToast('Logged out from Owner Portal. Returned to Customer View.', 'info');
  };

  const toggleUserRole = () => {
    if (!isOwnerAuthenticated || currentUser?.email.toLowerCase() !== PRIMARY_OWNER_EMAIL.toLowerCase()) {
      showToast('Security Alert: Only the verified shop owner (Azeez) can access Owner Mode.', 'error');
      return;
    }
    setUserRole((prev) => {
      const nextRole = prev === 'owner' ? 'customer' : 'owner';
      showToast(
        nextRole === 'customer' 
          ? '👁️ Switched to Customer Storefront Preview' 
          : '👑 Switched to Owner Management Mode', 
        'info'
      );
      return nextRole;
    });
  };

  // Enterprise Authentication Actions
  const openAuthModal = (role: UserRole = 'customer') => {
    setAuthModalDefaultRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithEmail = (email: string, password: string, requiredRole?: UserRole): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const user = userDirectory.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      showToast('No account registered with this email address.', 'error');
      return { success: false, message: 'Account not found. Please check spelling or sign up as a customer.' };
    }

    if (user.password !== cleanPass) {
      showToast('Incorrect password. Use "Forgot Password?" to reset.', 'error');
      return { success: false, message: 'Invalid password. If you forgot your password, please use the reset link.' };
    }

    // STRICT SINGLE-OWNER ACCESS CONTROL:
    // If attempting to log into Owner Portal or if user claims owner role:
    if (requiredRole === 'owner') {
      if (cleanEmail !== PRIMARY_OWNER_EMAIL.toLowerCase() || user.role !== 'owner') {
        showToast('Access Denied: This is a Customer account. Only 1 shop owner (Azeez) has management access.', 'error');
        return { 
          success: false, 
          message: 'Access Denied: Only the single authorized shop owner (Azeez) can log in to manage store settings and prices. Customers cannot access store controls.' 
        };
      }
    }

    // Strict role validation: Only the primary owner email can ever attain 'owner' session role
    const effectiveRole: UserRole = (user.role === 'owner' && cleanEmail === PRIMARY_OWNER_EMAIL.toLowerCase()) ? 'owner' : 'customer';

    const profile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: effectiveRole,
      createdAt: user.createdAt
    };

    setCurrentUser(profile);
    setUserRole(effectiveRole);
    if (effectiveRole === 'owner') {
      setIsOwnerAuthenticated(true);
      try { localStorage.setItem('smartech_owner_auth', 'true'); } catch {}
    } else {
      setIsOwnerAuthenticated(false);
      try { localStorage.removeItem('smartech_owner_auth'); } catch {}
    }

    try {
      localStorage.setItem('smartech_current_user', JSON.stringify(profile));
    } catch {}

    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${profile.name}! Signed in successfully.`, 'success');
    return { success: true, message: 'Signed in successfully' };
  };

  const registerUser = (data: { name: string; email: string; password: string; phone?: string; role?: UserRole }): { success: boolean; message: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return { success: false, message: 'Invalid email address format' };
    }

    if (data.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // STRICT OWNER PROTECTION: Public registration for owner role is permanently forbidden
    if (data.role === 'owner' || cleanEmail === PRIMARY_OWNER_EMAIL.toLowerCase()) {
      showToast('Owner registration is restricted. Only 1 shop owner account exists.', 'error');
      return { 
        success: false, 
        message: 'Owner registration is disabled to protect store data. Only 1 shop owner (Azeez) can access store management.' 
      };
    }

    const existing = userDirectory.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      showToast('An account with this email already exists. Please log in.', 'error');
      return { success: false, message: 'Account already exists with this email address' };
    }

    // All newly registered accounts are ALWAYS customer accounts
    const newAccount = {
      id: `usr-${Date.now().toString(36)}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      phone: data.phone?.trim(),
      role: 'customer' as UserRole,
      createdAt: new Date().toISOString()
    };

    const updated = [...userDirectory, newAccount];
    setUserDirectory(updated);
    try {
      localStorage.setItem('smartech_users', JSON.stringify(updated));
    } catch {}

    const profile: UserProfile = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      role: 'customer',
      createdAt: newAccount.createdAt
    };

    setCurrentUser(profile);
    setUserRole('customer');
    setIsOwnerAuthenticated(false);
    try {
      localStorage.removeItem('smartech_owner_auth');
      localStorage.setItem('smartech_current_user', JSON.stringify(profile));
    } catch {}

    setIsAuthModalOpen(false);
    showToast(`Account created successfully! Welcome, ${profile.name}.`, 'success');
    return { success: true, message: 'Account created successfully' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsOwnerAuthenticated(false);
    setUserRole('customer');
    try {
      localStorage.removeItem('smartech_current_user');
      localStorage.removeItem('smartech_owner_auth');
    } catch {}
    showToast('Signed out successfully. Switched to public customer view.', 'info');
  };

  const requestPasswordReset = (email: string): { success: boolean; message: string; otp?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = userDirectory.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      showToast('No account found with this email.', 'error');
      return { success: false, message: 'No registered account found with this email.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    setResetOtps(prev => ({
      ...prev,
      [cleanEmail]: { otp, expiresAt }
    }));

    showToast(`🔐 Verification OTP sent to ${cleanEmail}: [ ${otp} ]`, 'info');
    return { 
      success: true, 
      otp, 
      message: `A 6-digit verification code has been generated for ${cleanEmail}.` 
    };
  };

  const resetPasswordWithOtp = (email: string, otp: string, newPassword: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const req = resetOtps[cleanEmail];
    if (!req) {
      showToast('No active password reset request found for this email.', 'error');
      return { success: false, message: 'Please request a reset code first.' };
    }

    if (Date.now() > req.expiresAt) {
      showToast('Verification code has expired. Please request a new one.', 'error');
      return { success: false, message: 'OTP expired. Please request a new code.' };
    }

    if (req.otp !== cleanOtp) {
      showToast('Invalid verification code entered.', 'error');
      return { success: false, message: 'Incorrect verification code. Please check and retry.' };
    }

    const updated = userDirectory.map(u => {
      if (u.email.toLowerCase() === cleanEmail) {
        return { ...u, password: newPassword.trim() };
      }
      return u;
    });

    setUserDirectory(updated);
    try {
      localStorage.setItem('smartech_users', JSON.stringify(updated));
    } catch {}

    setResetOtps(prev => {
      const copy = { ...prev };
      delete copy[cleanEmail];
      return copy;
    });

    showToast('Password updated successfully! You can now log in with your new password.', 'success');
    return { success: true, message: 'Password reset successfully!' };
  };

  return (
    <ShopContext.Provider
      value={{
        shopSettings,
        updateShopSettings,
        resetShopSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        quickUpdatePriceAndStock,
        bulkUpdateProducts,
        resetToInitialProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedDiscount,
        couponCode,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        serviceBookings,
        createServiceBooking,
        updateServiceBooking,
        userPincode,
        setUserPincode,
        checkDelivery,
        toasts,
        showToast,
        removeToast,
        currentUser,
        userRole,
        isOwnerAuthenticated,
        loginWithEmail,
        registerUser,
        logoutUser,
        requestPasswordReset,
        resetPasswordWithOtp,
        isAuthModalOpen,
        authModalDefaultRole,
        openAuthModal,
        closeAuthModal,
        setUserRole,
        ownerLogin,
        ownerLogout,
        toggleUserRole
      }}
    >
      {children}

      {/* Global Toast Notification Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${
              t.type === 'success' ? 'toast-success' : t.type === 'error' ? 'toast-error' : 'toast-info'
            }`}
            onClick={() => removeToast(t.id)}
            role="alert"
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
