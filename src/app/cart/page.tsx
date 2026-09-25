'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { 
  Store, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function CartPage() {
  const { shopSettings } = useShop();

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <div className="breadcrumbs" style={{ marginBottom: '24px' }}>
        <Link href="/">Home</Link>
        <span className="separator"><ChevronRight size={14} /></span>
        <span className="current">Showroom Notice</span>
      </div>

      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '48px 36px',
        border: '1px solid var(--gray-200)',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#dcfce7',
          color: '#16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Store size={36} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '12px' }}>
          In-Person Walk-In Showroom
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--gray-600)', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto 24px' }}>
          Smartech Computers does not operate online cart ordering or courier delivery. 
          All our products are displayed for direct in-person inspection and testing at our Hindupur showroom.
        </p>

        {/* Store Location Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <MapPin size={22} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, color: 'var(--gray-900)', fontSize: '0.95rem' }}>
                Smartech Computers Showroom
              </div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.88rem' }}>
                RPGT Road, Near Shilpa Hospital, Hindupur, Andhra Pradesh - 515201
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#166534' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Live On-Desk Testing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Instant Counter Handover
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Price Negotiable in Shop
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> 1-Year Hardware Warranty
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
          <Link href="/products" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Browse Showroom Products <ArrowRight size={18} />
          </Link>

          <a 
            href={`https://wa.me/91${shopSettings.whatsappNumber || '9030400551'}?text=Hi%20Smartech%20Computers,%20I%20would%20like%20to%20inquire%20about%20your%20products%20available%20at%20your%20Hindupur%20showroom.`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-lg"
            style={{ background: '#16a34a', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <MessageSquare size={18} /> Inquire on WhatsApp
          </a>

          <a 
            href={`tel:${shopSettings.primaryPhone || '9030400551'}`}
            className="btn btn-outline btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <PhoneCall size={18} /> Call: {shopSettings.primaryPhone || '9030400551'}
          </a>
        </div>
      </div>
    </div>
  );
}
