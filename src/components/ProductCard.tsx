'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { ShoppingCart, Star, ShieldCheck, Eye, Check, Edit3 } from 'lucide-react';
import QuickViewModal from './QuickViewModal';
import QuickEditPriceModal from './QuickEditPriceModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isOwnerAuthenticated, userRole, currentUser } = useShop();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isEditPriceOpen, setIsEditPriceOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // Grade color
  const gradeClass = product.conditionGrade === 'Grade A+' 
    ? 'grade-a' 
    : product.conditionGrade === 'Grade A' 
      ? 'grade-b' 
      : 'grade-c';

  return (
    <>
      <div className="product-card group">
        {/* Badges */}
        <div className="product-card-badges">
          {product.discountPercent > 0 && (
            <span className="product-discount-badge">
              {product.discountPercent}% OFF
            </span>
          )}
          <span className={`product-grade-badge ${gradeClass}`}>
            {product.conditionGrade}
          </span>
          {isOwnerAuthenticated && userRole === 'owner' && currentUser?.email.toLowerCase() === 'azeez@smartechcomputers.com' && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditPriceOpen(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
              title="Fast Owner Price & Stock Edit"
            >
              <Edit3 size={12} /> Edit Price
            </button>
          )}
        </div>

        {/* Product Image Area */}
        <Link href={`/products/${product.id}`} className="product-image-wrapper">
          <img 
            src={product.image} 
            alt={product.title} 
            loading="lazy" 
          />

          {/* Quick Hover Action Bar */}
          <div className="product-quick-actions">
            <button 
              type="button" 
              className="quick-view-btn" 
              onClick={handleQuickView}
            >
              <Eye size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Quick Specs
            </button>
            <button 
              type="button" 
              className="quick-add-btn" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {isAdded ? (
                <>
                  <Check size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </>
              )}
            </button>
          </div>
        </Link>

        {/* Product Details */}
        <div className="product-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span className="product-brand">{product.brand}</span>
            <span style={{ fontSize: '0.7rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              <ShieldCheck size={12} /> {product.warranty.split('+')[0]}
            </span>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="product-title" title={product.title}>
              {product.title}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="product-rating">
            <div className="stars" style={{ display: 'flex', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={13} 
                  fill={star <= Math.round(product.rating) ? 'var(--accent)' : 'none'} 
                  stroke="var(--accent)" 
                />
              ))}
            </div>
            <span className="rating-count">({product.reviewsCount})</span>
          </div>

          {/* Quick spec pills preview */}
          {product.shortSpecs && product.shortSpecs.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
              {product.shortSpecs.slice(0, 2).map((spec, i) => (
                <span 
                  key={i} 
                  style={{
                    background: 'var(--gray-100)',
                    color: 'var(--gray-600)',
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Price & Savings */}
          <div className="product-pricing">
            <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <span className="product-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
            {product.discountPercent > 0 && (
              <span className="product-discount">Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}</span>
            )}
          </div>
          {product.isNegotiable !== false && (
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🤝 Price is Negotiable
            </div>
          )}

          {/* Stock availability */}
          <div className="product-availability">
            {product.stock > 0 ? (
              <span className="in-stock">
                ● In Stock {product.stock <= 5 && `(Only ${product.stock} left)`}
              </span>
            ) : (
              <span className="out-of-stock">● Currently Out of Stock</span>
            )}
          </div>

          {/* Direct Mobile/Visible Add to Cart */}
          <div style={{ marginTop: '12px' }}>
            <button 
              className={`btn btn-sm ${isAdded ? 'btn-secondary' : 'btn-primary'}`} 
              style={{ width: '100%', fontSize: '0.85rem' }}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {isAdded ? (
                <>
                  <Check size={16} /> Added in Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}

      {/* Owner Fast Edit Modal */}
      {isEditPriceOpen && (
        <QuickEditPriceModal 
          product={product} 
          isOpen={isEditPriceOpen} 
          onClose={() => setIsEditPriceOpen(false)} 
        />
      )}
    </>
  );
}
