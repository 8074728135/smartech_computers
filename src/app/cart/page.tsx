'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Truck, 
  ChevronRight,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    appliedDiscount, 
    couponCode, 
    applyCoupon, 
    removeCoupon,
    clearCart
  } = useShop();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState('');

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

  return (
    <div className="cart-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span className="separator"><ChevronRight size={14} /></span>
        <span className="current">Shopping Cart</span>
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '24px' }}>
        Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
      </h1>

      {cart.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '50px 20px', border: '1px solid var(--gray-200)' }}>
          <div className="empty-state-icon">🛒</div>
          <h3>Your shopping cart is empty</h3>
          <p>
            Explore our curated inventory of Consistent PARADOX gaming keyboards, refurbished laptops, and custom PCs in Hindupur.
          </p>

          <div style={{ maxWidth: '420px', margin: '20px auto 24px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px dashed #cbd5e1', textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={16} color="var(--primary)" /> Active Store Coupons & Promo Codes:
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>• <strong>SMARTECH100</strong>: Flat ₹100 OFF on orders above ₹1,000</div>
              <div>• <strong>FIRST500</strong>: Flat ₹500 OFF on orders above ₹5,000</div>
              <div>• <strong>UPGRADE10</strong>: 10% OFF on SSD & RAM upgrades</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link href="/products?category=accessories" className="btn btn-primary">
              View PARADOX Keyboards
            </Link>
            <Link href="/products?category=laptops" className="btn btn-outline">
              Browse Refurbished Laptops
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.title} />
                </div>

                <div className="cart-item-details">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className={`badge ${item.product.conditionGrade === 'Grade A+' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                        {item.product.conditionGrade}
                      </span>
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="cart-item-title">{item.product.title}</h3>
                      </Link>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="cart-item-remove"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="cart-item-meta">
                    Brand: <strong>{item.product.brand}</strong> • Warranty: <strong>{item.product.warranty.split('+')[0]}</strong>
                  </div>

                  <div className="cart-item-actions">
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-300)', borderRadius: '6px', overflow: 'hidden' }}>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        style={{ padding: '6px 12px', background: 'var(--gray-100)', border: 'none', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '6px 16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        style={{ padding: '6px 12px', background: 'var(--gray-100)', border: 'none', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="cart-item-price">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    {item.product.mrp > item.product.price && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                        ₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <Link href="/products" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                ← Add More Products from Showroom
              </Link>
              <button 
                onClick={clearCart}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Cart Order Summary Sidebar */}
          <div>
            <div className="cart-summary">
              <h3>Order Summary</h3>

              {/* Coupon Section */}
              {couponCode ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#d1fae5', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                  <span style={{ color: '#065f46', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={16} /> Coupon <strong>{couponCode}</strong> Applied!
                  </span>
                  <button 
                    onClick={removeCoupon}
                    style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem' }}
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <form onSubmit={handleApplyCoupon} className="coupon-input">
                    <input 
                      type="text" 
                      placeholder="Promo Code (FIRST500)" 
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                    />
                    <button type="submit">Apply</button>
                  </form>
                  {couponError && (
                    <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{couponError}</span>
                  )}
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                    💡 Use code <strong>FIRST500</strong> on orders above ₹5,000
                  </div>
                </div>
              )}

              {/* Rows */}
              <div className="summary-row">
                <span>Items Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="summary-row" style={{ color: 'var(--success)' }}>
                  <span>Discount Applied:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Safe Insured Delivery:</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
              </div>

              <div className="summary-row">
                <span>GST / Taxes:</span>
                <span>Included (0 extra)</span>
              </div>

              <div className="summary-row total">
                <span>Order Total:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-savings">
                🎉 You are saving on high-spec refurbished hardware!
              </div>

              <button 
                onClick={() => router.push('/checkout')}
                className="checkout-btn"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  <span>100% Secure Checkout via UPI / Card / COD</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCcw size={16} color="var(--success)" />
                  <span>7-Day Replacement Guarantee on All Systems</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
