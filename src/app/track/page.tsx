'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { 
  Search, 
  Wrench, 
  Clock, 
  MapPin, 
  PhoneCall, 
  CheckCircle2,
  ChevronRight,
  Store
} from 'lucide-react';

export default function TrackPage() {
  const { serviceBookings, shopSettings } = useShop();

  const [trackQuery, setTrackQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Search exclusively in repair job cards
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
      <div className="breadcrumbs" style={{ marginBottom: '24px' }}>
        <Link href="/">Home</Link>
        <span className="separator"><ChevronRight size={14} /></span>
        <span className="current">Track Repair Job Card</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.1)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Wrench size={32} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '8px' }}>
          Track In-Shop Repair Job Cards
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Did you drop off your laptop, motherboard, or desktop for repair? Enter your <strong>Job Card (e.g. SRV-8941)</strong> or registered 10-digit mobile number below.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} style={{ maxWidth: '540px', margin: '24px auto 0', display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Enter Job Card (SRV-8941) or Mobile Number..."
            value={trackQuery}
            onChange={(e) => { setTrackQuery(e.target.value); setHasSearched(true); }}
            className="input"
            style={{ flex: 1, padding: '14px 18px', fontSize: '1rem' }}
          />
          <button type="submit" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={18} /> Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {matchedServices.length === 0 ? (
          <div style={{ background: 'white', padding: '36px 20px', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gray-800)', marginBottom: '8px' }}>
              No Repair Job Cards Found
            </h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 18px' }}>
              We could not find any active job cards matching "{trackQuery}". Check your receipt slip or call our repair workbench directly.
            </p>
            <a 
              href={`tel:${shopSettings.primaryPhone || '9030400551'}`} 
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <PhoneCall size={16} /> Call Workshop: {shopSettings.primaryPhone || '9030400551'}
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-700)' }}>
              Found {matchedServices.length} In-Shop Job Card{matchedServices.length > 1 ? 's' : ''}:
            </div>

            {matchedServices.map((booking) => (
              <div key={booking.id} className="card" style={{ padding: '24px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                      Job Card #{booking.bookingNumber}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                      Received on: {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Customer: {booking.customerName}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '6px 14px', fontWeight: 700 }}>
                      ● {booking.status}
                    </span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px' }}>
                      Workshop Intake Date: {booking.scheduledDate}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px', fontSize: '0.88rem' }}>
                  <div>
                    <div><strong>Service Mode:</strong> 🏪 In-Shop Drop-Off</div>
                    <div><strong>Device:</strong> {booking.deviceType} ({booking.deviceBrandModel})</div>
                    <div><strong>Issue Reported:</strong> {booking.issueCategory}</div>
                  </div>

                  <div>
                    <div><strong>Technician:</strong> {booking.technicianName || 'Smartech Hardware Specialist'}</div>
                    <div><strong>Service Estimate:</strong> ₹{booking.estimatedCost.toLocaleString('en-IN')} <span style={{ color: '#16a34a', fontSize: '0.78rem', fontWeight: 700 }}>(Negotiable)</span></div>
                    <div><strong>Shop Location:</strong> RPGT Road, Near Shilpa Hospital</div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)', fontSize: '0.86rem', color: 'var(--gray-800)' }}>
                  <strong>Workbench Inspection & Diagnostic Notes:</strong> 
                  <div style={{ marginTop: '4px', color: 'var(--gray-600)' }}>
                    {booking.technicianNotes || 'Device safely logged on shop workbench. Hardware diagnostics running.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Helpful Shop Visit Info */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)', padding: '20px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Store size={28} style={{ color: '#16a34a' }} />
            <div>
              <div style={{ fontWeight: 800, color: '#14532d', fontSize: '0.95rem' }}>
                Collect Your Repaired Device at the Counter
              </div>
              <div style={{ color: '#166534', fontSize: '0.84rem' }}>
                Please bring your physical Job Card slip or show your mobile number during collection.
              </div>
            </div>
          </div>
          <a 
            href={`tel:${shopSettings.primaryPhone || '9030400551'}`}
            className="btn btn-sm btn-primary"
            style={{ background: '#16a34a', borderColor: '#16a34a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <PhoneCall size={14} /> Call Workshop
          </a>
        </div>
      </div>
    </div>
  );
}
