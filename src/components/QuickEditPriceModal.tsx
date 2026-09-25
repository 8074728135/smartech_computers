'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { X, Check, Save, Tag, Box, IndianRupee } from 'lucide-react';

interface QuickEditPriceModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickEditPriceModal({ product, isOpen, onClose }: QuickEditPriceModalProps) {
  const { quickUpdatePriceAndStock, showToast } = useShop();

  const [price, setPrice] = useState<number>(product.price);
  const [mrp, setMrp] = useState<number>(product.mrp);
  const [stock, setStock] = useState<number>(product.stock);
  const [isNegotiable, setIsNegotiable] = useState<boolean>(product.isNegotiable !== false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    quickUpdatePriceAndStock(product.id, Number(price), Number(stock), Number(mrp), isNegotiable);
    showToast(`Updated "${product.title}" price to ₹${Number(price).toLocaleString('en-IN')}`, 'success');
    onClose();
  };

  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            padding: '16px 20px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
              OWNER FAST EDIT
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Quick Price & Stock</span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <img 
              src={product.image} 
              alt={product.title} 
              style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '4px' }} 
            />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
                {product.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                Brand: <strong>{product.brand}</strong> • Category: <strong>{product.category}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Today's Selling Price (₹)
              </label>
              <input 
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={1}
                required
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '2px solid #2563eb', fontWeight: 800, fontSize: '1rem', color: '#1e40af', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Original MRP (₹)
              </label>
              <input 
                type="number"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                min={1}
                required
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.95rem', color: '#64748b', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Available Stock Units
              </label>
              <input 
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                min={0}
                required
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Live Customer Discount:</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>
                {discountPercent}% OFF
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
              <input 
                type="checkbox" 
                checked={isNegotiable} 
                onChange={(e) => setIsNegotiable(e.target.checked)} 
                style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
              />
              <span>🤝 Price is Negotiable (Show &ldquo;Price is Negotiable&rdquo; tag to customers)</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ background: '#f1f5f9', border: 'none', padding: '9px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{ background: '#2563eb', border: 'none', padding: '9px 18px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={15} /> Save Price & Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
