'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { X, Star, ShieldCheck, Check, ShoppingCart, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, setIsCartOpen } = useShop();

  const handleAddAndOpenCart = () => {
    addToCart(product, 1);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          padding: '32px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--gray-100)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--gray-600)'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {/* Image & Grade summary */}
          <div>
            <div style={{
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '260px',
              border: '1px solid var(--gray-200)'
            }}>
              <img 
                src={product.image} 
                alt={product.title} 
                style={{ maxHeight: '220px', objectFit: 'contain' }} 
              />
            </div>

            <div style={{ marginTop: '16px', padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`badge ${product.conditionGrade === 'Grade A+' ? 'badge-success' : 'badge-primary'}`}>
                  {product.conditionGrade}
                </span>
                Refurbished Condition Note
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '6px', lineHeight: 1.5 }}>
                {product.conditionSummary}
              </p>
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>
              {product.brand} • {product.category.toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--secondary)', margin: '6px 0 12px', lineHeight: 1.3 }}>
              {product.title}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', color: 'var(--accent)' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15} fill={s <= Math.round(product.rating) ? 'var(--accent)' : 'none'} stroke="var(--accent)" />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)' }}>
                {product.rating} ({product.reviewsCount} verified buyers)
              </span>
            </div>

            {/* Price Box */}
            <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span style={{ fontSize: '1rem', color: 'var(--gray-400)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '4px' }}>
                Inclusive of all taxes • Free store pickup or express courier
              </div>
              {product.isNegotiable !== false && (
                <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 800, marginTop: '4px' }}>
                  🤝 Price is Negotiable in Shop
                </div>
              )}
            </div>

            {/* Specs Highlights */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '8px' }}>
                Key Hardware Specifications:
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.shortSpecs.map((spec, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warranty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
              <ShieldCheck size={18} />
              <span>{product.warranty}</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '14px' }}
                onClick={handleAddAndOpenCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={18} />
                {product.stock > 0 ? 'Add to Cart & Checkout' : 'Out of Stock'}
              </button>
              <Link 
                href={`/products/${product.id}`}
                className="btn btn-outline"
                style={{ padding: '14px 20px' }}
                onClick={onClose}
              >
                Full Details <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
