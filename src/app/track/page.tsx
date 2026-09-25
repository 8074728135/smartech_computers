'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { 
  Search, 
  Package, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function TrackPage() {
  const { orders, serviceBookings } = useShop();

  const [trackQuery, setTrackQuery] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'orders' | 'services'>('all');
  const [hasSearched, setHasSearched] = useState(false);

  // Search in both orders and repair services
  const matchedOrders = orders.filter(o => 
    !trackQuery.trim() ||
    o.orderNumber.toLowerCase().includes(trackQuery.toLowerCase()) ||
    o.phone.includes(trackQuery) ||
    o.customerName.toLowerCase().includes(trackQuery.toLowerCase())
  );

  const matchedServices = serviceBookings.filter(s => 
    !trackQuery.trim() ||
    s.bookingNumber.toLowerCase().includes(trackQuery.toLowerCase()) ||
    s.phone.includes(trackQuery) ||
    s.customerName.toLowerCase().includes(trackQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '8px' }}>
          Track Your Order or Repair Status
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>
          Enter your <strong>Order Number (e.g. TC-94812)</strong>, <strong>Job Card (e.g. SRV-8941)</strong>, or mobile number
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} style={{ maxWidth: '540px', margin: '24px auto 0', display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Search by ID (TC-94812 / SRV-8941) or Mobile..."
            value={trackQuery}
            onChange={(e) => { setTrackQuery(e.target.value); setHasSearched(true); }}
            className="input"
            style={{ flex: 1, padding: '14px 18px', fontSize: '1rem' }}
          />
          <button type="submit" className="btn btn-primary btn-lg">
            <Search size={18} /> Track
          </button>
        </form>

        {/* Quick Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
          <button 
            className={`btn btn-sm ${activeType === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveType('all')}
          >
            All Activity ({matchedOrders.length + matchedServices.length})
          </button>
          <button 
            className={`btn btn-sm ${activeType === 'orders' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveType('orders')}
          >
            <Package size={14} /> Product Orders ({matchedOrders.length})
          </button>
          <button 
            className={`btn btn-sm ${activeType === 'services' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveType('services')}
          >
            <Wrench size={14} /> In-Shop Repair Job Cards ({matchedServices.length})
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Orders Results */}
        {(activeType === 'all' || activeType === 'orders') && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} style={{ color: 'var(--primary)' }} /> Product Orders
            </h3>

            {matchedOrders.length === 0 ? (
              <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--gray-200)', color: 'var(--gray-500)' }}>
                No product orders matching this search query.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {matchedOrders.map((order) => (
                  <div key={order.id} className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--gray-200)' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                          Order #{order.orderNumber}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                          Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Customer: {order.customerName}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                          ● {order.orderStatus}
                        </span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px' }}>
                          Estimated: <strong>{order.estimatedDelivery}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'var(--gray-50)', borderRadius: '4px', border: '1px solid var(--gray-200)' }} />
                          <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600 }}>
                            {item.title} (x{item.quantity})
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', background: 'var(--gray-50)', padding: '12px', borderRadius: '6px' }}>
                      <strong>Shipping to:</strong> {order.shippingAddress}, {order.city} - {order.pincode} • Phone: {order.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* In-Shop Repair Services Results */}
        {(activeType === 'all' || activeType === 'services') && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={20} style={{ color: '#7c3aed' }} /> In-Shop Repair Job Cards
            </h3>

            {matchedServices.length === 0 ? (
              <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--gray-200)', color: 'var(--gray-500)' }}>
                No repair bookings matching this search query.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {matchedServices.map((booking) => (
                  <div key={booking.id} className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--gray-200)' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                          Job Card #{booking.bookingNumber}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                          Received on: {new Date(booking.createdAt).toLocaleDateString('en-IN')} • Customer: {booking.customerName}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                          ● {booking.status}
                        </span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px' }}>
                          Received: {booking.scheduledDate}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px', fontSize: '0.88rem' }}>
                      <div>
                        <div><strong>Service Mode:</strong> 🏪 In-Shop Drop-Off</div>
                        <div><strong>Device:</strong> {booking.deviceType} - {booking.deviceBrandModel}</div>
                        <div><strong>Category:</strong> {booking.issueCategory}</div>
                      </div>

                      <div>
                        <div><strong>Assigned Tech:</strong> {booking.technicianName || 'Assigning soon...'}</div>
                        <div><strong>Initial Estimate:</strong> ₹{booking.estimatedCost.toLocaleString('en-IN')}</div>
                        <div><strong>Service Location:</strong> {booking.address}</div>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', borderLeft: '3px solid var(--primary)', fontSize: '0.85rem' }}>
                      <strong>Technician Notes / Work Log:</strong> {booking.technicianNotes || 'Device received, initial diagnostics in progress.'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
