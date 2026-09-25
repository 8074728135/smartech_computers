'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function CartDrawer() {
  const router = useRouter();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount,
    couponCode,
    appliedDiscount,
    applyCoupon,
    removeCoupon
  } = useShop();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const finalTotal = Math.max(0, cartSubtotal - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCode('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 10001,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'white',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideInRight 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={22} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)' }}>
              Your Cart ({cartCount})
            </h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{
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
          >
            <X size={18} />
          </button>
        </div>

        {/* Free delivery tracker */}
        <div style={{ padding: '10px 24px', background: 'var(--success-light)', color: '#065f46', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} />
          <span>Complimentary Safe Packaging & Transit Insurance included</span>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-700)' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '4px', marginBottom: '20px' }}>
                Add certified refurbished laptops, gaming towers, or accessories!
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => { setIsCartOpen(false); router.push('/products'); }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div 
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--gray-100)'
                  }}
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.title}
                    style={{
                      width: '74px',
                      height: '74px',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--gray-50)',
                      padding: '6px',
                      border: '1px solid var(--gray-200)',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <Link 
                        href={`/products/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: 'var(--gray-800)',
                          lineHeight: 1.3,
                          textDecoration: 'none'
                        }}
                      >
                        {item.product.title}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: '4px 0' }}>
                      <span className={`badge ${item.product.conditionGrade === 'Grade A+' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.65rem', padding: '1px 6px', marginRight: '6px' }}>
                        {item.product.conditionGrade}
                      </span>
                      {item.product.brand}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      {/* Quantity Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-300)', borderRadius: '6px', overflow: 'hidden' }}>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ padding: '4px 8px', background: 'var(--gray-100)', border: 'none', cursor: 'pointer' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ padding: '4px 12px', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          style={{ padding: '4px 8px', background: 'var(--gray-100)', border: 'none', cursor: 'pointer' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
            {/* Promo Code Input */}
            {couponCode ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#d1fae5', padding: '8px 12px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
                <span style={{ color: '#065f46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={15} /> Code <strong>{couponCode}</strong> applied!
                </span>
                <button 
                  onClick={removeCoupon}
                  style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input 
                  type="text" 
                  placeholder="Coupon code (e.g. FIRST500)" 
                  value={inputCode} 
                  onChange={(e) => setInputCode(e.target.value)}
                  className="input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', textTransform: 'uppercase', flex: 1 }}
                />
                <button type="submit" className="btn btn-sm btn-outline">
                  Apply
                </button>
              </form>
            )}
            {couponError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginBottom: '10px' }}>
                {couponError}
              </div>
            )}

            {/* Price Breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '6px' }}>
              <span>Subtotal:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {appliedDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--success)', marginBottom: '6px' }}>
                <span>Coupon Discount:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '10px' }}>
              <span>Shipping & Delivery:</span>
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', paddingTop: '10px', borderTop: '1px solid var(--gray-200)', marginBottom: '16px' }}>
              <span>Total Amount:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={handleProceedToCheckout}
                className="checkout-btn"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
              <Link 
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ textAlign: 'center', width: '100%', color: 'var(--gray-600)' }}
              >
                View Full Shopping Cart Page
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
