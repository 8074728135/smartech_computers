'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Laptop,
  Cpu,
  Monitor,
  HardDrive,
  BatteryCharging,
  Keyboard,
  Fan,
  Sparkles,
  MessageSquare,
  Store,
  ArrowRight,
  HelpCircle,
  Tag
} from 'lucide-react';

export default function ServicesPage() {
  const { repairServices, shopSettings } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories list
  const categories = ['all', ...Array.from(new Set(repairServices.map(s => s.category)))];

  const filteredServices = selectedCategory === 'all' 
    ? repairServices 
    : repairServices.filter(s => s.category === selectedCategory);

  return (
    <div className="services-page container">
      {/* Services Hero Header */}
      <div className="services-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '999px', fontSize: '0.85rem', color: '#93c5fd', marginBottom: '16px' }}>
          <Sparkles size={16} /> {shopSettings.storeName} • In-Shop Workbench Repair Lab
        </div>
        <h1>Computer, Laptop & Hardware Repairs</h1>
        <p>
          Damaged laptop, cracked screen, water spill, or dead desktop? Bring your device directly to our shop workbench: <strong>Near Shilpa Hospital, RPGT Road, Hindupur</strong>. No booking needed — walk in anytime for immediate front-of-counter inspection!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
          <a href="#services-catalog" className="btn btn-primary btn-lg">
            <Wrench size={18} /> View Services & Negotiable Rates
          </a>
          <a href={`tel:${shopSettings.primaryPhone}`} className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <PhoneCall size={18} /> Call Workshop: {shopSettings.primaryPhone}
          </a>
          <a 
            href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Smartech%20Computers,%20I%20have%20a%20damaged%20laptop/computer%20and%20want%20to%20bring%20it%20to%20your%20RPGT%20Road%20shop.`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-lg" 
            style={{ color: '#86efac', borderColor: '#86efac' }}
          >
            <MessageSquare size={18} /> WhatsApp Owner
          </a>
        </div>
      </div>

      {/* In-Shop Workbench Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--white)', border: '2px solid #2563eb', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>Walk-In Shop Repair</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>RPGT ROAD, NEAR SHILPA HOSPITAL</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            Visit our shop with your damaged laptop, desktop PC, monitor, or charger. All repairs are done in our dedicated workbench lab right in front of you with instant diagnosis!
          </p>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
            ✓ Open All 7 Days: 9:30 AM – 9:30 PM
          </div>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>🤝 Price is Negotiable</h3>
              <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 800 }}>COMPETITIVE LOCAL RATES</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            We match or beat local repair shop rates in Hindupur! You can negotiate prices directly with owner Azeez at our store counter according to your budget and spare part choices.
          </p>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#d97706', fontWeight: 700 }}>
            ✓ Fair counter bargaining • Direct owner pricing
          </div>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>Free 15-Min Diagnosis</h3>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 800 }}>FRONT-OF-DESK TESTING</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            We test your motherboard, screen lines, power jack, or SSD on our test bench before opening. Zero inspection fee and 100% genuine replacement parts with shop warranty.
          </p>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
            ✓ Zero hidden costs • Clear estimate upfront
          </div>
        </div>
      </div>

      {/* Services Catalog */}
      <div id="services-catalog" style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 28px' }}>
          <h2 className="section-title">In-Shop Repair Services & Rates</h2>
          <p style={{ color: 'var(--gray-500)' }}>
            All repairs handled at our RPGT Road shop. Starting prices listed below — <strong>price is negotiable at our store counter!</strong>
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm"
              style={{
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--white)',
                color: selectedCategory === cat ? 'white' : 'var(--gray-700)',
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--gray-300)'
              }}
            >
              {cat === 'all' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {filteredServices.map((srv) => (
            <div 
              key={srv.id} 
              className="service-card"
              style={{
                borderColor: 'var(--gray-200)',
                background: 'var(--white)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-primary">{srv.category}</span>
                  {srv.sameDayRepair ? (
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      ⚡ Same-Day Repair
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                      🔬 Chip-Level Lab
                    </span>
                  )}
                </div>

                <h3 style={{ marginTop: '14px', fontSize: '1.15rem', color: 'var(--secondary)' }}>{srv.title}</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', lineHeight: 1.5 }}>{srv.description}</p>

                {/* Common Issues / Signs */}
                {srv.commonIssues && srv.commonIssues.length > 0 && (
                  <div style={{ margin: '14px 0', borderTop: '1px solid var(--gray-100)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Common Symptoms / Signs:
                    </div>
                    <ul style={{ fontSize: '0.8rem', color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {srv.commonIssues.slice(0, 3).map((issue, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Price, Turnaround & Negotiable Tag */}
              <div>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '14px 0 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Starting Price:</div>
                      <div className="service-price" style={{ margin: 0, fontSize: '1.35rem', color: '#1e40af', fontWeight: 900 }}>
                        ₹{srv.startingPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Est. Time:</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)' }}>
                        {srv.turnaroundTime}
                      </div>
                    </div>
                  </div>

                  {srv.isNegotiable !== false && (
                    <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1', fontSize: '0.78rem', color: '#16a34a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>🤝</span> <span>Price is Negotiable at Store Counter</span>
                    </div>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a 
                    href={`tel:${shopSettings.primaryPhone}`}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8rem', padding: '8px 10px' }}
                  >
                    <PhoneCall size={14} /> Call Shop
                  </a>
                  <a 
                    href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Smartech%20Computers,%20I%20want%20to%20inquire%20about%20${encodeURIComponent(srv.title)}%20(Starting%20Price:%20Rs.${srv.startingPrice})%20for%20my%20laptop/computer.%20Can%20I%20bring%20it%20to%20your%20RPGT%20Road%20shop?`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8rem', padding: '8px 10px', background: '#16a34a', borderColor: '#16a34a' }}
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WALK-IN WORKBENCH SERVICE GUIDE (NO APPOINTMENT NEEDED) */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        borderRadius: 'var(--radius-2xl)', 
        padding: '40px 32px', 
        color: 'white',
        marginBottom: '60px',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,99,235,0.3)', border: '1px solid rgba(96,165,250,0.3)', color: '#93c5fd', padding: '6px 18px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '20px' }}>
            <Store size={18} /> Walk-In Service Center • No Advance Booking Needed
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.3, marginBottom: '16px', color: 'white' }}>
            How to Get Your Computer or Laptop Repaired in Hindupur
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            You do <strong>not need any appointment or booking slot</strong>. Just walk into our shop with your damaged product. We inspect it immediately on our workbench right in front of you.
          </p>

          {/* 4 Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', textAlign: 'left', marginBottom: '36px' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#60a5fa', marginBottom: '8px' }}>01</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>Bring Product to Shop</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Walk into Smartech Computers at RPGT Road, Near Shilpa Hospital. Bring your laptop/PC with charger.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399', marginBottom: '8px' }}>02</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>Free 15-Min Diagnosis</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Our technician tests motherboard voltages, screen, RAM, or power socket in front of you with zero fee.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24', marginBottom: '8px' }}>03</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>🤝 Negotiable Quote</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Get an instant transparent price quote. Prices are flexible and negotiable at our counter to give you the best deal!
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#c084fc', marginBottom: '8px' }}>04</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>Instant Repair & Pickup</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Screens, keyboards, SSDs, and thermal paste done same-day. Tested and handed back with shop warranty.
              </p>
            </div>
          </div>

          {/* Shop Location & Quick Contact */}
          <div style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', flexWrap: 'wrap', justifyContent: 'center' }}>
              <MapPin size={20} style={{ color: '#60a5fa' }} />
              <span><strong>Shop Address:</strong> {shopSettings.storeName}, {shopSettings.streetDetails}, {shopSettings.locationDetails}, {shopSettings.city} - {shopSettings.pincode}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <Clock size={18} style={{ color: '#34d399' }} />
              <span><strong>Timings:</strong> {shopSettings.timings} (Open All 7 Days)</span>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
              <a 
                href={`tel:${shopSettings.primaryPhone}`} 
                className="btn btn-primary btn-lg"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <PhoneCall size={18} /> Call Owner Azeez: {shopSettings.primaryPhone}
              </a>
              <a 
                href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Azeez,%20I%20am%20coming%20to%20Smartech%20Computers%20for%20laptop/PC%20repair.`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-lg"
                style={{ color: '#86efac', borderColor: '#86efac', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageSquare size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
