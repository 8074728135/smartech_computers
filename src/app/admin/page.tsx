'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { Product, ConditionGrade, ProductCategory, ServiceStatus, OrderStatus, ShopSettings, RepairServiceInfo } from '@/types';
import { 
  Plus, 
  Save, 
  Trash2, 
  Search, 
  RotateCcw, 
  Package, 
  Wrench, 
  ShoppingCart, 
  FileSpreadsheet, 
  Download, 
  Check, 
  CheckCircle2, 
  ExternalLink, 
  Tag, 
  Settings, 
  Store, 
  Phone, 
  MapPin, 
  Clock, 
  QrCode, 
  Megaphone, 
  Printer, 
  Eye, 
  LogOut,
  X,
  Edit3,
  ArrowRight
} from 'lucide-react';
import OwnerLoginGate from '@/components/OwnerLoginGate';
import ImageDropzone from '@/components/ImageDropzone';
import BulkInventoryUploader from '@/components/BulkInventoryUploader';

export default function AdminPage() {
  const { 
    isOwnerAuthenticated,
    currentUser,
    ownerLogout,
    toggleUserRole,
    userRole,
    shopSettings,
    updateShopSettings,
    resetShopSettings,
    products, 
    addProduct, 
    deleteProduct, 
    quickUpdatePriceAndStock, 
    bulkUpdateProducts, 
    resetToInitialProducts,
    repairServices,
    addRepairService,
    updateRepairService,
    deleteRepairService,
    serviceBookings,
    updateServiceBooking,
    orders,
    updateOrderStatus,
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'daily-price' | 'services' | 'add-product' | 'orders' | 'settings' | 'bulk'>('daily-price');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Inline edited values state for products: { [productId]: { price, stock, mrp, isNegotiable } }
  const [editState, setEditState] = useState<Record<string, { price: number; stock: number; mrp: number; isNegotiable: boolean }>>({});

  // Repair Services Pricing Manager State
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');
  const [serviceEditState, setServiceEditState] = useState<Record<string, { startingPrice: number; turnaroundTime: string; isNegotiable: boolean }>>({});
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  // Add Service Form State
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Screen & Display');
  const [newServiceStartingPrice, setNewServiceStartingPrice] = useState<number>(499);
  const [newServiceTurnaroundTime, setNewServiceTurnaroundTime] = useState('45 - 90 Minutes');
  const [newServiceSameDay, setNewServiceSameDay] = useState(true);
  const [newServiceIsNegotiable, setNewServiceIsNegotiable] = useState(true);
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServiceCommonIssues, setNewServiceCommonIssues] = useState('');

  // Shop Settings Form State
  const [settingsForm, setSettingsForm] = useState<ShopSettings>({ ...shopSettings });

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Consistent');
  const [newCategory, setNewCategory] = useState<ProductCategory>('accessories');
  const [newGrade, setNewGrade] = useState<ConditionGrade>('Grade A+');
  const [newPrice, setNewPrice] = useState<number>(1299);
  const [newMrp, setNewMrp] = useState<number>(2499);
  const [newStock, setNewStock] = useState<number>(20);
  const [newIsNegotiable, setNewIsNegotiable] = useState(true);
  const [newWarranty, setNewWarranty] = useState('1 Year Consistent Manufacturer Warranty');
  const [newSpecsText, setNewSpecsText] = useState('19 Keys Anti-Ghosting, RGB Fixed Light, 87 Keys, Windows Lock Key, Type-C Interface');
  const [newConditionSummary, setNewConditionSummary] = useState('Brand New Factory Pack with 1-Year National Warranty');
  const [newDescription, setNewDescription] = useState('Featured gaming keyboard directly from Smartech Computers Hindupur.');
  const [newImages, setNewImages] = useState<string[]>([]);

  // Track low stock products (< 5)
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  // Filter products for daily price manager
  const displayedProducts = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  // Handle inline price/stock/negotiable change for products
  const handleInputChange = (id: string, field: 'price' | 'stock' | 'mrp' | 'isNegotiable', value: any) => {
    const p = products.find(prod => prod.id === id);
    const current = editState[id] || {
      price: p?.price || 0,
      stock: p?.stock || 0,
      mrp: p?.mrp || 0,
      isNegotiable: p?.isNegotiable !== false
    };

    setEditState({
      ...editState,
      [id]: {
        ...current,
        [field]: value
      }
    });
  };

  // Save single product row
  const handleSaveRow = (id: string) => {
    const row = editState[id];
    if (!row) return;
    quickUpdatePriceAndStock(id, row.price, row.stock, row.mrp, row.isNegotiable);
    const updated = { ...editState };
    delete updated[id];
    setEditState(updated);
  };

  // Save all modified product rows in 1 click
  const handleSaveAll = () => {
    const keys = Object.keys(editState);
    if (keys.length === 0) {
      showToast('No pending price or stock changes to save.', 'info');
      return;
    }
    keys.forEach(id => {
      const row = editState[id];
      quickUpdatePriceAndStock(id, row.price, row.stock, row.mrp, row.isNegotiable);
    });
    setEditState({});
    showToast(`Updated ${keys.length} product prices across the live website!`, 'success');
  };

  // Handle Add Product submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Product title is required.', 'error');
      return;
    }

    const shortSpecs = newSpecsText.split(',').map(s => s.trim()).filter(Boolean);

    const defaultCategoryFallbacks: Record<string, string> = {
      laptops: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      desktops: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
      monitors: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
      components: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
      accessories: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80'
    };

    const finalImage = newImages.length > 0 
      ? newImages[0] 
      : (defaultCategoryFallbacks[newCategory] || defaultCategoryFallbacks.accessories);

    const finalImagesList = newImages.length > 0 ? newImages : [finalImage];

    addProduct({
      title: newTitle,
      brand: newBrand,
      category: newCategory,
      conditionGrade: newGrade,
      price: Number(newPrice),
      mrp: Number(newMrp),
      stock: Number(newStock),
      isNegotiable: newIsNegotiable,
      rating: 4.8,
      reviewsCount: 1,
      image: finalImage,
      images: finalImagesList,
      warranty: newWarranty,
      shortSpecs,
      specs: {
        'Condition': newGrade,
        'Brand': newBrand,
        'Warranty': newWarranty
      },
      description: newDescription,
      conditionSummary: newConditionSummary,
      isDailyDeal: true,
      isFeatured: true
    });

    // Reset form
    setNewTitle('');
    setNewPrice(1299);
    setNewMrp(2499);
    setNewStock(10);
    setNewIsNegotiable(true);
    setNewImages([]);
    setActiveTab('daily-price');
  };

  // Service Edit Handlers
  const handleServiceInputChange = (id: string, field: 'startingPrice' | 'turnaroundTime' | 'isNegotiable', value: any) => {
    const srv = repairServices.find(s => s.id === id);
    const current = serviceEditState[id] || {
      startingPrice: srv?.startingPrice || 0,
      turnaroundTime: srv?.turnaroundTime || '',
      isNegotiable: srv?.isNegotiable !== false
    };

    setServiceEditState({
      ...serviceEditState,
      [id]: {
        ...current,
        [field]: value
      }
    });
  };

  const handleSaveServiceRow = (id: string) => {
    const row = serviceEditState[id];
    if (!row) return;
    updateRepairService(id, {
      startingPrice: Number(row.startingPrice),
      turnaroundTime: row.turnaroundTime,
      isNegotiable: row.isNegotiable
    });
    const updated = { ...serviceEditState };
    delete updated[id];
    setServiceEditState(updated);
  };

  const handleSaveAllServices = () => {
    const keys = Object.keys(serviceEditState);
    if (keys.length === 0) {
      showToast('No pending service price changes to save.', 'info');
      return;
    }
    keys.forEach(id => {
      const row = serviceEditState[id];
      updateRepairService(id, {
        startingPrice: Number(row.startingPrice),
        turnaroundTime: row.turnaroundTime,
        isNegotiable: row.isNegotiable
      });
    });
    setServiceEditState({});
    showToast(`Updated ${keys.length} service prices across the live website!`, 'success');
  };

  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) {
      showToast('Service title is required.', 'error');
      return;
    }
    const issues = newServiceCommonIssues.split(',').map(s => s.trim()).filter(Boolean);
    addRepairService({
      title: newServiceTitle.trim(),
      category: newServiceCategory,
      icon: 'Wrench',
      startingPrice: Number(newServiceStartingPrice),
      turnaroundTime: newServiceTurnaroundTime,
      sameDayRepair: newServiceSameDay,
      isNegotiable: newServiceIsNegotiable,
      description: newServiceDescription.trim() || `${newServiceTitle} done on workbench at our RPGT Road shop in Hindupur.`,
      commonIssues: issues.length > 0 ? issues : ['Device malfunction', 'Damaged component']
    });

    // Reset form
    setNewServiceTitle('');
    setNewServiceStartingPrice(499);
    setNewServiceTurnaroundTime('45 - 90 Minutes');
    setNewServiceDescription('');
    setNewServiceCommonIssues('');
    setIsAddServiceOpen(false);
  };

  // Filter repair services
  const displayedServices = repairServices.filter(s => {
    if (serviceCategoryFilter !== 'all' && s.category !== serviceCategoryFilter) return false;
    if (serviceSearchTerm.trim()) {
      const q = serviceSearchTerm.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Handle Shop Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings(settingsForm);
  };

  // Security gate
  if (!isOwnerAuthenticated || currentUser?.email.toLowerCase() !== 'azeez@smartechcomputers.com') {
    return <OwnerLoginGate />;
  }

  return (
    <div className="admin-page container">
      {/* Top Banner */}
      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ background: '#10b981', color: 'white', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
              🛡️ VERIFIED SHOP OWNER PORTAL
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              RPGT Road, Hindupur
            </span>
          </div>
          <h2>Smartech Store Management</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            Logged in as <strong>Azeez ({currentUser.email})</strong>. Update daily hardware prices, stock, repair services, and contact info in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={resetToInitialProducts}
            className="btn btn-outline btn-sm"
            title="Reset catalog to official baseline"
          >
            <RotateCcw size={14} /> Reset Baseline Stock
          </button>
          <Link href="/" className="btn btn-outline btn-sm" target="_blank">
            <ExternalLink size={14} /> View Live Showroom
          </Link>
          <button 
            onClick={ownerLogout}
            className="btn btn-sm btn-outline"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            <LogOut size={14} /> Exit Owner Mode
          </button>
        </div>
      </div>

      {/* Top KPI Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Showroom Products</span>
            <div className="stat-icon products"><Package size={20} color="#2563eb" /></div>
          </div>
          <div className="stat-value">{products.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            {lowStockCount > 0 ? (
              <span style={{ color: 'var(--danger)', fontWeight: 700 }}>⚠️ {lowStockCount} items low stock</span>
            ) : (
              'All items in stock'
            )}
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-label">In-Shop Repair Services</span>
            <div className="stat-icon services"><Wrench size={20} color="#7c3aed" /></div>
          </div>
          <div className="stat-value">{repairServices.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            Live workbench services with editable prices
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-label">Customer Orders</span>
            <div className="stat-icon orders"><ShoppingCart size={20} color="#059669" /></div>
          </div>
          <div className="stat-value">{orders.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            ₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('en-IN')} total sales
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-label">Pending Hardware Edits</span>
            <div className="stat-icon revenue"><Tag size={20} color="#2563eb" /></div>
          </div>
          <div className="stat-value">{Object.keys(editState).length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 700 }}>
            {Object.keys(editState).length > 0 ? '⚠️ Unsaved edits! Click Save All below' : 'All prices live & synced'}
          </div>
        </div>
      </div>

      {/* Admin Tabs Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid var(--gray-200)',
        marginBottom: '24px',
        overflowX: 'auto',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('daily-price')}
          style={{
            padding: '12px 18px',
            fontSize: '0.95rem',
            fontWeight: 800,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'daily-price' ? 'var(--primary)' : 'var(--gray-600)',
            borderBottom: activeTab === 'daily-price' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Tag size={16} /> 🏷️ Hardware Prices & Stock
        </button>

        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '12px 18px',
            fontSize: '0.95rem',
            fontWeight: 800,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'services' ? '#7c3aed' : 'var(--gray-600)',
            borderBottom: activeTab === 'services' ? '3px solid #7c3aed' : '3px solid transparent',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Wrench size={16} /> 🔧 Repair Services & Pricing ({repairServices.length})
        </button>

        <button
          onClick={() => setActiveTab('add-product')}
          style={{
            padding: '12px 18px',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'add-product' ? 'var(--primary)' : 'var(--gray-600)',
            borderBottom: activeTab === 'add-product' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={16} /> Add Product / Refurbished PC
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 18px',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'orders' ? 'var(--primary)' : 'var(--gray-600)',
            borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShoppingCart size={16} /> Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '12px 18px',
            fontSize: '0.95rem',
            fontWeight: 800,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'settings' ? '#d97706' : 'var(--gray-600)',
            borderBottom: activeTab === 'settings' ? '3px solid #d97706' : '3px solid transparent',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Store size={16} /> 🏪 Shop Profile & Contact Details
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          style={{
            padding: '12px 18px',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'bulk' ? 'var(--primary)' : 'var(--gray-600)',
            borderBottom: activeTab === 'bulk' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileSpreadsheet size={16} /> 📊 Bulk Upload
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DAILY PRICE & STOCK EDITOR                              */}
      {/* ============================================================== */}
      {activeTab === 'daily-price' && (
        <div className="admin-table-container">
          <div className="admin-table-header">
            <div>
              <h3>Fast Daily Hardware Price & Stock Updater</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                Change selling price, stock, or toggle &ldquo;Price is Negotiable&rdquo; directly in the table. Click &ldquo;Save Row&rdquo; or &ldquo;Save All Daily Changes&rdquo;.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {Object.keys(editState).length > 0 && (
                <button 
                  onClick={handleSaveAll}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                >
                  <Save size={16} /> Save All ({Object.keys(editState).length}) Daily Changes
                </button>
              )}

              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="sort-select"
              >
                <option value="all">All Categories</option>
                <option value="accessories">Keyboards & Accessories</option>
                <option value="laptops">Refurbished Laptops</option>
                <option value="desktops">Gaming & Desktops</option>
                <option value="components">SSDs & RAM</option>
                <option value="monitors">Monitors</option>
              </select>

              <div className="admin-table-search">
                <input 
                  type="text" 
                  placeholder="Quick search PARADOX, ThinkPad, SSD..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product & Grade</th>
                  <th>Category</th>
                  <th>Original MRP (₹)</th>
                  <th style={{ color: 'var(--primary)' }}>Today's Selling Price (₹)</th>
                  <th>Stock Units</th>
                  <th>Discount %</th>
                  <th>Negotiable?</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((p) => {
                  const isModified = Boolean(editState[p.id]);
                  const currentPrice = editState[p.id]?.price !== undefined ? editState[p.id].price : p.price;
                  const currentMrp = editState[p.id]?.mrp !== undefined ? editState[p.id].mrp : p.mrp;
                  const currentStock = editState[p.id]?.stock !== undefined ? editState[p.id].stock : p.stock;
                  const currentNegotiable = editState[p.id]?.isNegotiable !== undefined ? editState[p.id].isNegotiable : (p.isNegotiable !== false);
                  const calcDiscount = currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0;

                  return (
                    <tr key={p.id} style={{ background: isModified ? '#fefce8' : 'transparent' }}>
                      {/* Product Name & Thumb */}
                      <td>
                        <div className="product-cell">
                          <img 
                            src={p.image} 
                            alt={p.title} 
                            className="product-thumb" 
                            style={{ objectFit: 'contain' }}
                          />
                          <div>
                            <div className="product-name" style={{ fontSize: '0.88rem' }}>{p.title}</div>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                              <span className={`badge ${p.conditionGrade === 'Grade A+' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                                {p.conditionGrade}
                              </span>
                              <span className="product-sku">{p.brand}</span>
                              {p.isDailyDeal && (
                                <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Daily Offer</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>
                        {p.category}
                      </td>

                      {/* MRP Input */}
                      <td>
                        <input 
                          type="number" 
                          value={currentMrp}
                          onChange={(e) => handleInputChange(p.id, 'mrp', Number(e.target.value))}
                          className="inline-price-edit"
                          style={{ width: '90px' }}
                          title="Original MRP strikethrough price"
                        />
                      </td>

                      {/* Selling Price Input */}
                      <td>
                        <input 
                          type="number" 
                          value={currentPrice}
                          onChange={(e) => handleInputChange(p.id, 'price', Number(e.target.value))}
                          className="inline-price-edit"
                          style={{ 
                            width: '110px', 
                            fontWeight: 800, 
                            color: 'var(--primary)',
                            background: isModified ? '#fef3c7' : 'white',
                            borderColor: isModified ? '#f59e0b' : 'var(--gray-300)'
                          }}
                          title="Customer checkout selling price"
                        />
                      </td>

                      {/* Stock Quantity Input */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input 
                            type="number" 
                            value={currentStock}
                            onChange={(e) => handleInputChange(p.id, 'stock', Number(e.target.value))}
                            className="inline-price-edit"
                            style={{ 
                              width: '70px', 
                              color: currentStock <= 2 ? 'var(--danger)' : 'inherit',
                              fontWeight: 700
                            }}
                          />
                          {currentStock <= 0 && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 800 }}>OUT</span>}
                        </div>
                      </td>

                      {/* Discount % */}
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.85rem' }}>
                          {calcDiscount}% OFF
                        </span>
                      </td>

                      {/* Negotiable Toggle */}
                      <td>
                        <button
                          type="button"
                          onClick={() => handleInputChange(p.id, 'isNegotiable', !currentNegotiable)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: currentNegotiable ? '#dcfce7' : '#f1f5f9',
                            borderColor: currentNegotiable ? '#86efac' : '#cbd5e1',
                            color: currentNegotiable ? '#15803d' : '#64748b'
                          }}
                          title="Toggle whether price is negotiable at store counter"
                        >
                          {currentNegotiable ? '🤝 Negotiable' : 'Fixed'}
                        </button>
                      </td>

                      {/* Row Actions */}
                      <td>
                        <div className="table-actions">
                          {isModified && (
                            <button 
                              onClick={() => handleSaveRow(p.id)}
                              className="table-action-btn"
                              style={{ background: 'var(--success)', color: 'white', borderColor: 'var(--success)' }}
                              title="Save this row"
                            >
                              <Save size={15} />
                            </button>
                          )}
                          <Link 
                            href={`/products/${p.id}`} 
                            className="table-action-btn"
                            target="_blank"
                            title="View on live website"
                          >
                            <ExternalLink size={15} />
                          </Link>
                          <button 
                            onClick={() => {
                              if (confirm(`Remove "${p.title}" from catalog?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="table-action-btn delete"
                            title="Delete product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: REPAIR SERVICES & LIVE PRICING MANAGER                  */}
      {/* ============================================================== */}
      {activeTab === 'services' && (
        <div>
          {/* Header Bar */}
          <div className="admin-table-container" style={{ marginBottom: '24px' }}>
            <div className="admin-table-header">
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={20} style={{ color: '#7c3aed' }} /> In-Shop Repair Services & Pricing Manager
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                  Adjust service starting prices in real-time according to surrounding shops in Hindupur. Control whether &ldquo;Price is Negotiable&rdquo; appears under the price tag.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                {Object.keys(serviceEditState).length > 0 && (
                  <button 
                    onClick={handleSaveAllServices}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#16a34a', borderColor: '#16a34a' }}
                  >
                    <Save size={16} /> Save All ({Object.keys(serviceEditState).length}) Service Prices
                  </button>
                )}

                <button 
                  onClick={() => setIsAddServiceOpen(!isAddServiceOpen)}
                  className="btn btn-primary btn-sm"
                  style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                >
                  <Plus size={16} /> {isAddServiceOpen ? 'Close Form' : 'Add New Service Type'}
                </button>

                <select 
                  value={serviceCategoryFilter} 
                  onChange={(e) => setServiceCategoryFilter(e.target.value)}
                  className="sort-select"
                >
                  <option value="all">All Service Categories</option>
                  <option value="Screen & Display">Screen & Display</option>
                  <option value="Input Devices">Input Devices (Keyboards)</option>
                  <option value="Power & Battery">Power & Battery</option>
                  <option value="Core Hardware">Core Hardware (Motherboard/BGA)</option>
                  <option value="Maintenance">Maintenance & Cleaning</option>
                  <option value="Performance">Performance & SSD</option>
                  <option value="Body & Chassis">Body & Hinge Fabrication</option>
                  <option value="Desktop & Towers">Desktop & Custom Towers</option>
                </select>

                <div className="admin-table-search">
                  <input 
                    type="text" 
                    placeholder="Search repair services..."
                    value={serviceSearchTerm}
                    onChange={(e) => setServiceSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ADD NEW SERVICE TYPE FORM */}
            {isAddServiceOpen && (
              <div style={{ background: '#f8fafc', padding: '24px', borderBottom: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--secondary)' }}>
                    ➕ Add New In-Shop Repair Service Type
                  </h4>
                  <button 
                    onClick={() => setIsAddServiceOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddNewService} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Service Title *</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. MacBook Liquid Damage Cleaning"
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Category *</label>
                    <select 
                      className="input" 
                      value={newServiceCategory} 
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                    >
                      <option value="Screen & Display">Screen & Display</option>
                      <option value="Input Devices">Input Devices (Keyboards)</option>
                      <option value="Power & Battery">Power & Battery</option>
                      <option value="Core Hardware">Core Hardware (Motherboard/BGA)</option>
                      <option value="Maintenance">Maintenance & Cleaning</option>
                      <option value="Performance">Performance & SSD</option>
                      <option value="Body & Chassis">Body & Hinge Fabrication</option>
                      <option value="Desktop & Towers">Desktop & Custom Towers</option>
                      <option value="Other">Other Repairs</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Starting Price / Cost (₹) *</label>
                    <input 
                      type="number" 
                      className="input" 
                      placeholder="499"
                      value={newServiceStartingPrice}
                      onChange={(e) => setNewServiceStartingPrice(Number(e.target.value))}
                      required 
                      min={0}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Turnaround Time *</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. 45 - 90 Minutes or Same Day"
                      value={newServiceTurnaroundTime}
                      onChange={(e) => setNewServiceTurnaroundTime(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">Common Symptoms / Signs (comma-separated)</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. Device not turning on, burning smell, trackpad stopped working"
                      value={newServiceCommonIssues}
                      onChange={(e) => setNewServiceCommonIssues(e.target.value)}
                    />
                  </div>

                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">Description / Scope of Work</label>
                    <textarea 
                      className="input" 
                      rows={2}
                      placeholder="Explain how this service is performed in the shop..."
                      value={newServiceDescription}
                      onChange={(e) => setNewServiceDescription(e.target.value)}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '24px', flexWrap: 'wrap', padding: '12px 16px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, color: '#1e40af' }}>
                      <input 
                        type="checkbox" 
                        checked={newServiceIsNegotiable} 
                        onChange={(e) => setNewServiceIsNegotiable(e.target.checked)} 
                        style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                      />
                      <span>🤝 Price is Negotiable at Store Counter (Show negotiable badge to customers)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, color: '#16a34a' }}>
                      <input 
                        type="checkbox" 
                        checked={newServiceSameDay} 
                        onChange={(e) => setNewServiceSameDay(e.target.checked)} 
                        style={{ width: '18px', height: '18px', accentColor: '#16a34a' }}
                      />
                      <span>⚡ Same-Day Workbench Repair</span>
                    </label>
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" style={{ background: '#7c3aed', borderColor: '#7c3aed' }}>
                      <Plus size={16} /> Add Service to Shop Catalog
                    </button>
                    <button type="button" onClick={() => setIsAddServiceOpen(false)} className="btn btn-outline">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SERVICES PRICING TABLE */}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Service Type</th>
                    <th>Category</th>
                    <th style={{ color: 'var(--primary)' }}>Starting Cost / Price (₹)</th>
                    <th>Turnaround Time</th>
                    <th>Price Negotiable?</th>
                    <th>Same-Day?</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedServices.map((srv) => {
                    const isModified = Boolean(serviceEditState[srv.id]);
                    const currentPrice = serviceEditState[srv.id]?.startingPrice !== undefined ? serviceEditState[srv.id].startingPrice : srv.startingPrice;
                    const currentTime = serviceEditState[srv.id]?.turnaroundTime !== undefined ? serviceEditState[srv.id].turnaroundTime : srv.turnaroundTime;
                    const currentNegotiable = serviceEditState[srv.id]?.isNegotiable !== undefined ? serviceEditState[srv.id].isNegotiable : (srv.isNegotiable !== false);

                    return (
                      <tr key={srv.id} style={{ background: isModified ? '#fefce8' : 'transparent' }}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--secondary)' }}>
                            {srv.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', maxWidth: '280px', marginTop: '2px', lineHeight: 1.3 }}>
                            {srv.description}
                          </div>
                        </td>

                        <td>
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            {srv.category}
                          </span>
                        </td>

                        {/* Starting Price Edit Input */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--gray-500)' }}>₹</span>
                            <input 
                              type="number" 
                              value={currentPrice}
                              onChange={(e) => handleServiceInputChange(srv.id, 'startingPrice', Number(e.target.value))}
                              className="inline-price-edit"
                              style={{ 
                                width: '100px', 
                                fontWeight: 800, 
                                color: 'var(--primary)',
                                background: isModified ? '#fef3c7' : 'white',
                                borderColor: isModified ? '#f59e0b' : 'var(--gray-300)'
                              }}
                              min={0}
                              title="Live starting price on website"
                            />
                          </div>
                        </td>

                        {/* Turnaround Time Edit Input */}
                        <td>
                          <input 
                            type="text" 
                            value={currentTime}
                            onChange={(e) => handleServiceInputChange(srv.id, 'turnaroundTime', e.target.value)}
                            className="inline-price-edit"
                            style={{ 
                              width: '130px', 
                              fontWeight: 600,
                              background: isModified ? '#fef3c7' : 'white',
                              borderColor: isModified ? '#f59e0b' : 'var(--gray-300)'
                            }}
                            title="Estimated time to complete repair"
                          />
                        </td>

                        {/* Negotiable Toggle */}
                        <td>
                          <button
                            type="button"
                            onClick={() => handleServiceInputChange(srv.id, 'isNegotiable', !currentNegotiable)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: currentNegotiable ? '#dcfce7' : '#f1f5f9',
                              borderColor: currentNegotiable ? '#86efac' : '#cbd5e1',
                              color: currentNegotiable ? '#15803d' : '#64748b'
                            }}
                            title="Toggle negotiable tag on services page"
                          >
                            {currentNegotiable ? '🤝 Negotiable' : 'Fixed'}
                          </button>
                        </td>

                        {/* Same Day Badge */}
                        <td>
                          {srv.sameDayRepair ? (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>⚡ Yes</span>
                          ) : (
                            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>🔬 Lab</span>
                          )}
                        </td>

                        {/* Row Actions */}
                        <td>
                          <div className="table-actions">
                            {isModified && (
                              <button 
                                onClick={() => handleSaveServiceRow(srv.id)}
                                className="table-action-btn"
                                style={{ background: 'var(--success)', color: 'white', borderColor: 'var(--success)' }}
                                title="Save price & details for this service"
                              >
                                <Save size={15} />
                              </button>
                            )}
                            <Link 
                              href="/services" 
                              className="table-action-btn"
                              target="_blank"
                              title="View on services page"
                            >
                              <ExternalLink size={15} />
                            </Link>
                            <button 
                              onClick={() => {
                                if (confirm(`Remove "${srv.title}" from repair services?`)) {
                                  deleteRepairService(srv.id);
                                }
                              }}
                              className="table-action-btn delete"
                              title="Delete service"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* IN-SHOP REPAIR JOB CARDS ARCHIVE */}
          <div className="admin-table-container">
            <div className="admin-table-header">
              <div>
                <h3>Walk-In Workbench Repair Records (Hindupur Shop)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                  Track devices brought into our RPGT Road shop, update diagnosis notes, and record status.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Job Card No</th>
                    <th>Customer & Phone</th>
                    <th>Device & Problem</th>
                    <th>Drop-Off Date</th>
                    <th>Status</th>
                    <th>Assigned Tech</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceBookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--secondary)' }}>
                          #{b.bookingNumber}
                        </strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{b.phone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{b.deviceType} ({b.deviceBrandModel})</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', maxWidth: '240px' }}>
                          {b.issueDescription}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        <div>{b.scheduledDate}</div>
                        <div style={{ color: 'var(--gray-400)' }}>{b.timeSlot}</div>
                      </td>
                      <td>
                        <select 
                          value={b.status} 
                          onChange={(e) => updateServiceBooking(b.id, { status: e.target.value as ServiceStatus })}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-300)', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          <option value="Received">Received</option>
                          <option value="Technician Assigned">Technician Assigned</option>
                          <option value="Diagnosing">Diagnosing</option>
                          <option value="Awaiting Parts">Awaiting Parts</option>
                          <option value="Repair Complete">Repair Complete</option>
                          <option value="Ready for Delivery">Ready for Delivery</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Assign Tech..." 
                          value={b.technicianName || ''}
                          onChange={(e) => updateServiceBooking(b.id, { technicianName: e.target.value })}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-300)', fontSize: '0.8rem', width: '120px' }}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <a 
                            href={`tel:${b.phone}`} 
                            className="btn btn-sm btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Call
                          </a>
                          <a 
                            href={`https://wa.me/91${b.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(b.customerName)},%20regarding%20your%20repair%20job%20card%20#${b.bookingNumber}%20at%20Smartech%20Computers`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#16a34a', borderColor: '#16a34a' }}
                          >
                            WA
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ADD NEW PRODUCT / REFURBISHED PC                        */}
      {/* ============================================================== */}
      {activeTab === 'add-product' && (
        <div className="admin-form-container">
          <div className="admin-form-header">
            <h3>Publish New Product to Hindupur Catalog</h3>
            <p>Add new refurbished laptops, custom gaming PCs, Consistent PARADOX keyboards, or NVMe upgrades.</p>
          </div>

          <form onSubmit={handleAddProductSubmit} className="admin-form">
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Product Title *</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Dell Latitude 7490 Core i7 8th Gen 16GB 512GB SSD"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Brand *</label>
              <select className="input" value={newBrand} onChange={(e) => setNewBrand(e.target.value)}>
                <option value="Consistent">Consistent</option>
                <option value="Dell">Dell</option>
                <option value="Lenovo">Lenovo</option>
                <option value="HP">HP</option>
                <option value="Samsung">Samsung</option>
                <option value="Smartech Custom">Smartech Custom</option>
                <option value="Apple">Apple</option>
                <option value="Logitech">Logitech</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Category *</label>
              <select className="input" value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)}>
                <option value="accessories">Keyboards & Accessories</option>
                <option value="laptops">Refurbished Laptops</option>
                <option value="desktops">Gaming & Desktops</option>
                <option value="components">SSDs & RAM</option>
                <option value="monitors">Monitors</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Condition Grade *</label>
              <select className="input" value={newGrade} onChange={(e) => setNewGrade(e.target.value as any)}>
                <option value="Grade A+">Grade A+ (Brand New / Like-New)</option>
                <option value="Grade A">Grade A (Minor Normal Cosmetic Signs)</option>
                <option value="Grade B">Grade B (Value Deal)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Selling Price (₹) *</label>
              <input 
                type="number" 
                className="input" 
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Original MRP (₹) *</label>
              <input 
                type="number" 
                className="input" 
                value={newMrp}
                onChange={(e) => setNewMrp(Number(e.target.value))}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">In-Stock Quantity *</label>
              <input 
                type="number" 
                className="input" 
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                required
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700, color: 'var(--secondary)' }}>
                <input 
                  type="checkbox" 
                  checked={newIsNegotiable} 
                  onChange={(e) => setNewIsNegotiable(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span>🤝 Price is Negotiable at Store Counter (Show negotiable badge to customers)</span>
              </label>
              <p style={{ margin: '4px 0 0 28px', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                Enables walk-in customers to know they can discuss rates at your RPGT Road counter, helping you compete with surrounding computer shops.
              </p>
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800 }}>Product Photos (Drag & Drop or Browse)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 400 }}>Direct photo upload from phone/PC (No URL link needed)</span>
              </label>
              <ImageDropzone 
                images={newImages} 
                onChange={setNewImages} 
                maxFiles={6} 
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Key Specifications (comma-separated bullets)</label>
              <input 
                type="text" 
                className="input" 
                value={newSpecsText}
                onChange={(e) => setNewSpecsText(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Warranty Statement</label>
              <input 
                type="text" 
                className="input" 
                value={newWarranty}
                onChange={(e) => setNewWarranty(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Marketing Description</label>
              <textarea 
                className="input" 
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <Plus size={18} /> Publish to Showroom Catalog
              </button>
              <button type="button" onClick={() => setActiveTab('daily-price')} className="btn btn-outline btn-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SHOP PROFILE & CONTACT SETTINGS                         */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div className="admin-form-container">
          <div className="admin-form-header">
            <h3>Smartech Computers - Store Profile & Contacts</h3>
            <p>Update phone numbers, UPI payment ID, store timings, and address displayed across the entire website.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="admin-form">
            <div className="input-group">
              <label className="input-label">Shop / Business Name *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Shop Owner / Manager Name *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.ownerName}
                onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Primary Phone Number *</label>
              <input 
                type="tel" 
                className="input" 
                value={settingsForm.primaryPhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, primaryPhone: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Secondary Phone Number *</label>
              <input 
                type="tel" 
                className="input" 
                value={settingsForm.secondaryPhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, secondaryPhone: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">WhatsApp Number for Customer Inquiries *</label>
              <input 
                type="tel" 
                className="input" 
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">UPI ID for Customer QR Payments *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.upiId}
                onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                placeholder="e.g. 9030400551@ybl"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Street Details *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.streetDetails}
                onChange={(e) => setSettingsForm({ ...settingsForm, streetDetails: e.target.value })}
                placeholder="e.g. RPGT Road, Hindupur"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Location Details / Landmark *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.locationDetails}
                onChange={(e) => setSettingsForm({ ...settingsForm, locationDetails: e.target.value })}
                placeholder="e.g. Hindupur, Near Shilpa Hospital"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">City *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.city}
                onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">PIN Code *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.pincode}
                onChange={(e) => setSettingsForm({ ...settingsForm, pincode: e.target.value })}
                required
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Showroom & Workshop Timings *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.timings}
                onChange={(e) => setSettingsForm({ ...settingsForm, timings: e.target.value })}
                required
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Announcement Banner Text (Top of Homepage)</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.announcement}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} /> Save & Apply Store Details
              </button>
              <button type="button" onClick={resetShopSettings} className="btn btn-outline btn-lg">
                <RotateCcw size={16} /> Reset Default Smartech Info
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: STORE ORDERS MANAGER                                    */}
      {/* ============================================================== */}
      {activeTab === 'orders' && (
        <div className="admin-table-container">
          <div className="admin-table-header">
            <div>
              <h3>Customer Product Orders</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                Track delivery fulfillment, payment status, and order dispatch.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Customer</th>
                  <th>Items Purchased</th>
                  <th>Total Amount</th>
                  <th>Payment Mode</th>
                  <th>Fulfillment Status</th>
                  <th>Estimated Delivery</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--secondary)' }}>
                        #{o.orderNumber}
                      </strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{o.phone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.8rem' }}>
                            • {item.title} (x{item.quantity})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        ₹{o.total.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.75rem' }}>
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={o.orderStatus} 
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-300)', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {o.estimatedDelivery}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: BULK DATA UPLOAD & INVENTORY IMPORT                     */}
      {/* ============================================================== */}
      {activeTab === 'bulk' && (
        <BulkInventoryUploader />
      )}
    </div>
  );
}
