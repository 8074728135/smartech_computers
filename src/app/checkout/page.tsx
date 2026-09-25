'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  QrCode, 
  Banknote, 
  CreditCard, 
  ArrowRight,
  Phone,
  User,
  ShoppingBag,
  Store,
  MessageSquare
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, appliedDiscount, createOrder, userPincode, shopSettings, showToast } = useShop();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(shopSettings.city || 'Hindupur');
  const [pincode, setPincode] = useState(userPincode || '515201');
  const [deliveryType, setDeliveryType] = useState<'courier' | 'pickup'>('courier');
  const [paymentMethod, setPaymentMethod] = useState<'UPI / Online' | 'Cash on Delivery (COD)' | 'Card'>('UPI / Online');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const finalTotal = Math.max(0, cartSubtotal - appliedDiscount);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty! Please add a product before placing an order.', 'error');
      return;
    }

    if (!name || !phone) {
      showToast('Please enter your full name and phone number', 'error');
      return;
    }

    if (deliveryType === 'courier' && (!address || !pincode)) {
      showToast('Please provide your complete delivery address and pincode', 'error');
      return;
    }

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      conditionGrade: item.product.conditionGrade
    }));

    const newOrder = createOrder({
      customerName: name,
      phone,
      email: email || `${phone}@customer.smartech.in`,
      shippingAddress: deliveryType === 'courier' 
        ? address 
        : `Store Self-Pickup: ${shopSettings.storeName}, ${shopSettings.streetDetails}, ${shopSettings.locationDetails}`,
      city: deliveryType === 'courier' ? city : shopSettings.city,
      pincode: deliveryType === 'courier' ? pincode : shopSettings.pincode,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: appliedDiscount,
      deliveryCharge: 0,
      total: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'UPI / Online' ? 'Paid' : 'Pending (COD)',
      estimatedDelivery: deliveryType === 'pickup' 
        ? 'Ready for pickup in 1 hour at RPGT Road shop' 
        : (pincode.startsWith('515') ? 'Today by 5:00 PM (Local Hindupur Delivery)' : 'Tomorrow by 6:00 PM')
    });

    setPlacedOrder(newOrder);
  };

  // UPI deep link
  const upiLink = `upi://pay?pa=${shopSettings.upiId}&pn=${encodeURIComponent(shopSettings.storeName)}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent('Smartech Computers Order')}`;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {placedOrder ? (
        /* Order Success Confirmation */
        <div style={{ maxWidth: '640px', margin: '0 auto', background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '40px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={44} />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '6px' }}>
            Order Placed with {shopSettings.storeName}!
          </h1>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
            Order Receipt ID: #{placedOrder.orderNumber}
          </div>

          <p style={{ color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '24px' }}>
            Thank you, <strong>{placedOrder.customerName}</strong>! {shopSettings.ownerName} and the Smartech team at RPGT Road Hindupur are preparing your items.
          </p>

          <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'left', marginBottom: '28px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Status:</strong>
              <span className="badge badge-success">{placedOrder.orderStatus}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Estimated Delivery / Ready:</strong>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{placedOrder.estimatedDelivery}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Delivery Mode:</strong>
              <span>{placedOrder.shippingAddress}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Payment:</strong>
              <span>{placedOrder.paymentMethod} ({placedOrder.paymentStatus})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--gray-200)', fontSize: '1.05rem', fontWeight: 900 }}>
              <span>Total Amount:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--secondary)' }}>₹{placedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a 
              href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Smartech%20Computers,%20I%20have%20placed%20order%20#${placedOrder.orderNumber}%20for%20₹${placedOrder.total}.%20Please%20confirm%20delivery.`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ color: '#16a34a', borderColor: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <MessageSquare size={16} /> WhatsApp Order Details
            </a>
            <Link href="/track" className="btn btn-primary">
              Track Order Live
            </Link>
            <Link href="/" className="btn btn-ghost">
              Back to Showroom
            </Link>
          </div>
        </div>
      ) : (
        /* Checkout Form & Summary */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'flex-start' }}>
          {/* Left: Form */}
          <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={22} style={{ color: 'var(--primary)' }} /> Customer & Delivery Details
            </h2>

            <form onSubmit={handlePlaceOrder}>
              {/* Delivery method toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div 
                  onClick={() => setDeliveryType('courier')}
                  style={{
                    border: deliveryType === 'courier' ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                    background: deliveryType === 'courier' ? '#eff6ff' : 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Truck size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Courier Delivery</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>To your address (Free Insured Shipping)</div>
                  </div>
                </div>

                <div 
                  onClick={() => setDeliveryType('pickup')}
                  style={{
                    border: deliveryType === 'pickup' ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                    background: deliveryType === 'pickup' ? '#eff6ff' : 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Store size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Shop Pickup</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>RPGT Road, Hindupur</div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g. K. Venkatesh" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Mobile Number (WhatsApp) *</label>
                  <input 
                    type="tel" 
                    className="input" 
                    placeholder="e.g. 9876543210" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label className="input-label">Email ID (optional)</label>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="e.g. customer@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Address Fields if courier */}
              {deliveryType === 'courier' && (
                <>
                  <div className="input-group" style={{ marginBottom: '16px' }}>
                    <label className="input-label">Street Address / Landmark *</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Door No, Street Name, Area, Landmark in Hindupur" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required={deliveryType === 'courier'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div className="input-group">
                      <label className="input-label">Town / City *</label>
                      <input 
                        type="text" 
                        className="input" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required={deliveryType === 'courier'}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">PIN Code *</label>
                      <input 
                        type="text" 
                        className="input" 
                        maxLength={6}
                        placeholder="515201" 
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        required={deliveryType === 'courier'}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Payment Methods */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-200)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '14px' }}>
                  Select Payment Option
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'UPI / Online' ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                      background: paymentMethod === 'UPI / Online' ? '#eff6ff' : 'var(--white)',
                      cursor: 'pointer'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'UPI / Online'} 
                      onChange={() => setPaymentMethod('UPI / Online')}
                    />
                    <QrCode size={22} style={{ color: 'var(--primary)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Direct UPI Payment (GPay / PhonePe / Paytm)</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>
                        Pay to Smartech Computers UPI: <strong>{shopSettings.upiId}</strong>
                      </div>
                    </div>
                  </label>

                  {/* UPI QR Display when selected */}
                  {paymentMethod === 'UPI / Online' && (
                    <div style={{ background: '#f8fafc', border: '1px dashed #3b82f6', borderRadius: '10px', padding: '16px', textAlign: 'center', marginTop: '-4px' }}>
                      <div style={{ fontSize: '0.82rem', color: '#1e3a8a', fontWeight: 700, marginBottom: '8px' }}>
                        Scan or pay via any UPI App to Smartech Computers:
                      </div>
                      <div style={{ display: 'inline-block', background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ width: '130px', height: '130px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', flexDirection: 'column', gap: '4px' }}>
                          <QrCode size={70} color="#1e40af" />
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1e3a8a' }}>{shopSettings.upiId}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '8px' }}>
                        Amount: <strong>₹{finalTotal.toLocaleString('en-IN')}</strong> • Tap Place Order after paying
                      </div>
                    </div>
                  )}

                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'Cash on Delivery (COD)' ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                      background: paymentMethod === 'Cash on Delivery (COD)' ? '#eff6ff' : 'var(--white)',
                      cursor: 'pointer'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'Cash on Delivery (COD)'} 
                      onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                    />
                    <Banknote size={22} style={{ color: 'var(--success)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Cash on Delivery (COD) / Pay at Handover</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>
                        Inspect the item seal upon delivery in Hindupur before payment
                      </div>
                    </div>
                  </label>

                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'Card' ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                      background: paymentMethod === 'Card' ? '#eff6ff' : 'var(--white)',
                      cursor: 'pointer'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'Card'} 
                      onChange={() => setPaymentMethod('Card')}
                    />
                    <CreditCard size={22} style={{ color: 'var(--secondary)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Credit / Debit Card</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>Swipe at shop or online gateway</div>
                    </div>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', fontSize: '1.05rem', fontWeight: 800 }}>
                  <ShieldCheck size={20} /> Confirm Order with Smartech (₹{finalTotal.toLocaleString('en-IN')})
                </button>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--gray-200)' }}>
              Order Review ({cart.length} Items)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed var(--gray-300)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '8px' }}>
                    No items in cart currently.
                  </p>
                  <Link href="/products" className="btn btn-sm btn-primary">
                    Browse Smartech Catalog
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.title} 
                      style={{ width: '50px', height: '50px', objectFit: 'contain', background: 'var(--gray-50)', borderRadius: '6px', padding: '4px', border: '1px solid var(--gray-200)' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.3 }}>
                        {item.product.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        Qty: {item.quantity} • <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{item.product.conditionGrade}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Coupon Savings:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Local Delivery / Pickup:</span>
                <span style={{ color: 'var(--success)', fontWeight: 800 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, color: 'var(--secondary)', paddingTop: '10px', borderTop: '2px solid var(--gray-200)', marginTop: '6px' }}>
                <span>Total Amount:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>
              🛡️ <strong>Smartech Computers Warranty:</strong> All items are tested by Azeez on our RPGT Road workbench before handover.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
