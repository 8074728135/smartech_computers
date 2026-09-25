'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { Product, ConditionGrade, ProductCategory, ServiceStatus, OrderStatus, ShopSettings } from '@/types';
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
  Home,
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
  LogOut
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
    serviceBookings,
    updateServiceBooking,
    orders,
    updateOrderStatus,
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'daily-price' | 'add-product' | 'services' | 'orders' | 'settings' | 'bulk'>('daily-price');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Inline edited values state: { [productId]: { price, stock, mrp } }
  const [editState, setEditState] = useState<Record<string, { price: number; stock: number; mrp: number }>>({});

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

  // Handle inline price/stock change
  const handleInputChange = (id: string, field: 'price' | 'stock' | 'mrp', value: number) => {
    const current = editState[id] || {
      price: products.find(p => p.id === id)?.price || 0,
      stock: products.find(p => p.id === id)?.stock || 0,
      mrp: products.find(p => p.id === id)?.mrp || 0
    };

    setEditState({
      ...editState,
      [id]: {
        ...current,
        [field]: value
      }
    });
  };

  // Save single inline row
  const handleSaveRow = (id: string) => {
    const row = editState[id];
    if (!row) return;
    quickUpdatePriceAndStock(id, row.price, row.stock, row.mrp);
    const updated = { ...editState };
    delete updated[id];
    setEditState(updated);
  };

  // Save all modified rows in 1 click
  const handleSaveAll = () => {
    const keys = Object.keys(editState);
    if (keys.length === 0) {
      showToast('No pending price or stock changes to save.', 'info');
      return;
    }
    keys.forEach(id => {
      const row = editState[id];
      quickUpdatePriceAndStock(id, row.price, row.stock, row.mrp);
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
    setNewImages([]);
    setActiveTab('daily-price');
  };

  // Handle Shop Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings(settingsForm);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Brand', 'Category', 'ConditionGrade', 'SellingPrice', 'MRP', 'Stock', 'Warranty'];
    const rows = products.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.brand,
      p.category,
      p.conditionGrade,
      p.price,
      p.mrp,
      p.stock,
      `"${p.warranty.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartech_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported inventory CSV spreadsheet!', 'success');
  };

  // If not authenticated or not the single authorized owner, render the secure Owner Gate
  if (!isOwnerAuthenticated || currentUser?.email.toLowerCase() !== 'azeez@smartechcomputers.com') {
    return <OwnerLoginGate />;
  }

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: '1240px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
            🛡️ Verified Store Owner: Azeez • Single-Owner Security Active
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--secondary)' }}>
            Shop Manager & Daily Price Editor
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            {shopSettings.locationDetails}, {shopSettings.streetDetails} • Contact: {shopSettings.primaryPhone} / {shopSettings.secondaryPhone}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link 
            href="/products" 
            className="btn btn-outline btn-sm"
            onClick={() => {
              if (userRole !== 'customer') toggleUserRole();
            }}
            style={{ background: '#f8fafc', fontWeight: 700 }}
          >
            <Eye size={14} /> View as Customer
          </Link>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('settings')}
            style={{ background: '#0f172a', color: 'white' }}
          >
            <Settings size={15} /> Update Shop Details
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('add-product')}
          >
            <Plus size={16} /> Add Product
          </button>
          <button 
            type="button"
            className="btn btn-outline btn-sm"
            onClick={ownerLogout}
            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
            title="Lock Owner Portal"
          >
            <LogOut size={14} /> Lock / Exit
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Products</span>
            <div className="stat-icon products"><Package size={20} color="#d97706" /></div>
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
            <span className="stat-label">Repair & Home Visits</span>
            <div className="stat-icon services"><Wrench size={20} color="#7c3aed" /></div>
          </div>
          <div className="stat-value">{serviceBookings.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            {serviceBookings.filter(s => s.status === 'Received').length} new appointments
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
            <span className="stat-label">Pending Price Edits</span>
            <div className="stat-icon revenue"><Tag size={20} color="#2563eb" /></div>
          </div>
          <div className="stat-value">{Object.keys(editState).length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 700 }}>
            {Object.keys(editState).length > 0 ? '⚠️ Unsaved edits! Click Save All below' : 'All prices live & synced'}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--gray-200)', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('daily-price')}
          style={{
            padding: '12px 18px',
            fontSize: '0.95rem',
            fontWeight: 700,
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
          <Tag size={16} /> ⚡ Daily Price & Stock Editor
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
          onClick={() => setActiveTab('services')}
          style={{
            padding: '12px 18px',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'services' ? 'var(--primary)' : 'var(--gray-600)',
            borderBottom: activeTab === 'services' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Wrench size={16} /> Home Service & Repair Requests ({serviceBookings.length})
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
          <FileSpreadsheet size={16} /> 📊 Bulk Upload & Data Management
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DAILY PRICE & STOCK EDITOR                              */}
      {/* ============================================================== */}
      {activeTab === 'daily-price' && (
        <div className="admin-table-container">
          <div className="admin-table-header">
            <div>
              <h3>Fast Daily Price & Stock Updater</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                Change selling price or stock count directly in the table. Click "Save Row" or "Save All Daily Changes".
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((p) => {
                  const isModified = Boolean(editState[p.id]);
                  const currentPrice = editState[p.id]?.price !== undefined ? editState[p.id].price : p.price;
                  const currentMrp = editState[p.id]?.mrp !== undefined ? editState[p.id].mrp : p.mrp;
                  const currentStock = editState[p.id]?.stock !== undefined ? editState[p.id].stock : p.stock;
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

          <div className="admin-table-footer">
            <div>
              Showing <strong>{displayedProducts.length}</strong> items in Smartech showroom
            </div>
            <button onClick={resetToInitialProducts} className="btn btn-ghost btn-sm" style={{ color: 'var(--gray-500)' }}>
              <RotateCcw size={13} /> Reset Smartech Default Inventory
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SHOP PROFILE & DETAILS SETTINGS (DEDICATED OWNER OPTION) */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store size={22} style={{ color: 'var(--primary)' }} /> Shop Profile & Contact Details
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '4px' }}>
                Update your store name, phone numbers, WhatsApp, RPGT Road address, and UPI payment details. Any change saved here is immediately reflected live on the header, footer, checkout, and receipt pages.
              </p>
            </div>

            <button 
              type="button" 
              onClick={resetShopSettings} 
              className="btn btn-ghost btn-sm" 
              style={{ color: 'var(--gray-500)' }}
            >
              <RotateCcw size={14} /> Reset to Original Details
            </button>
          </div>

          <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
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
              <label className="input-label">State *</label>
              <input 
                type="text" 
                className="input" 
                value={settingsForm.state}
                onChange={(e) => setSettingsForm({ ...settingsForm, state: e.target.value })}
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

            <div className="input-group">
              <label className="input-label">Store Opening Timings *</label>
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

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="submit" className="btn btn-primary btn-lg" style={{ background: '#d97706', borderColor: '#d97706' }}>
                <Save size={18} /> Save Shop Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ADD NEW PRODUCT FORM                                    */}
      {/* ============================================================== */}
      {activeTab === 'add-product' && (
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>
            Add New Product to Smartech Inventory
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '28px' }}>
            Enter new Consistent accessories, refurbished laptops, or gaming desktop rigs. They will instantly appear on the storefront.
          </p>

          <form onSubmit={handleAddProductSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Product Title *</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Consistent PARADOX Gaming Wired Keyboard (87 Keys RGB, Type-C)"
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
      {/* TAB 4: REPAIR & HOME SERVICE BOOKINGS MANAGER                  */}
      {/* ============================================================== */}
      {activeTab === 'services' && (
        <div className="admin-table-container">
          <div className="admin-table-header">
            <div>
              <h3>Customer Repair & Home Service Appointments (Hindupur)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                Assign technicians, update job card status, and record notes.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Card No</th>
                  <th>Customer & Phone</th>
                  <th>Service Mode</th>
                  <th>Device & Issue</th>
                  <th>Appointment Slot</th>
                  <th>Status</th>
                  <th>Assigned Tech</th>
                  <th>Actions</th>
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
                      <span className={`badge ${b.serviceMode === 'home_visit' ? 'badge-primary' : 'badge-accent'}`}>
                        {b.serviceMode === 'home_visit' ? '🏠 Home Visit' : '🏪 Shop Drop'}
                      </span>
                      {b.serviceMode === 'home_visit' && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', marginTop: '2px', maxWidth: '160px' }}>
                          PIN: {b.pincode}
                        </div>
                      )}
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
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-300)', fontSize: '0.8rem', width: '130px' }}
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
