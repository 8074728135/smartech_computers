'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { 
  Laptop, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  Truck, 
  RotateCcw,
  Settings
} from 'lucide-react';

export default function Footer() {
  const { shopSettings } = useShop();

  return (
    <footer className="footer">
      {/* Trust Highlights Bar */}
      <div style={{ background: '#0b1120', borderBottom: '1px solid #1e293b', padding: '28px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>42-Point QC Certified</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>Tested on BGA workbenches in Hindupur</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <RotateCcw size={26} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>7 Days Easy Replacement</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>Up to 1-Year hardware shop warranty</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                <Wrench size={26} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>Doorstep Home Service</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>Senior technician visits your home/office</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <Truck size={26} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>Insured Delivery & Pickup</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>Fast local delivery or shop pickup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        {/* Brand Information */}
        <div className="footer-brand">
          <Link href="/" className="logo" style={{ color: 'white' }}>
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6C18 4.34315 16.6569 3 15 3H9C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9H15C16.6569 9 18 10.3431 18 12C18 13.6569 16.6569 15 15 15H9C7.34315 15 6 16.3431 6 18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="2" fill="#facc15" />
              </svg>
            </div>
            <div>
              <span style={{ color: 'white' }}>SMARTECH</span>
              <span style={{ color: '#60a5fa', marginLeft: '4px' }}>COMPUTERS</span>
              <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
                HINDUPUR • NEAR SHILPA HOSPITAL • RPGT ROAD
              </span>
            </div>
          </Link>
          <p>
            Your trusted local destination in Hindupur for original Consistent PARADOX gaming keyboards, corporate-leased refurbished laptops, custom gaming PCs, genuine accessories, and chip-level motherboard & screen repairs.
          </p>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <MapPin className="icon" size={18} />
              <span>{shopSettings.streetDetails}, {shopSettings.locationDetails}, {shopSettings.city} - {shopSettings.pincode}</span>
            </div>
            <div className="footer-contact-item">
              <Phone className="icon" size={18} />
              <span>
                <a href={`tel:${shopSettings.primaryPhone}`} style={{ color: 'inherit' }}>{shopSettings.primaryPhone}</a> / <a href={`tel:${shopSettings.secondaryPhone}`} style={{ color: 'inherit' }}>{shopSettings.secondaryPhone}</a>
              </span>
            </div>
            <div className="footer-contact-item">
              <Mail className="icon" size={18} />
              <span>smartechcomputers.hdp@gmail.com</span>
            </div>
            <div className="footer-contact-item">
              <Clock className="icon" size={18} />
              <span>{shopSettings.timings}</span>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div>
          <h4 className="footer-heading">Shop Hardware</h4>
          <div className="footer-links">
            <Link href="/products?category=accessories" className="footer-link" style={{ color: '#facc15', fontWeight: 600 }}>Consistent PARADOX Keyboard</Link>
            <Link href="/products?category=laptops" className="footer-link">Refurbished ThinkPads & Latitudes</Link>
            <Link href="/products?category=desktops" className="footer-link">Custom Gaming & Tower PCs</Link>
            <Link href="/products?category=components" className="footer-link">Consistent NVMe SSDs & RAM</Link>
            <Link href="/products?category=monitors" className="footer-link">IPS & Gaming Monitors</Link>
            <Link href="/products?category=accessories" className="footer-link">Universal Type-C Fast Chargers</Link>
            <Link href="/products" className="footer-link">Browse Full Daily Deals</Link>
          </div>
        </div>

        {/* Repair & Home Services */}
        <div>
          <h4 className="footer-heading">Repair Services</h4>
          <div className="footer-links">
            <Link href="/services" className="footer-link">Doorstep Home Visit (Hindupur)</Link>
            <Link href="/services" className="footer-link">Laptop Screen Replacement</Link>
            <Link href="/services" className="footer-link">Keyboard & Touchpad Repairs</Link>
            <Link href="/services" className="footer-link">Battery & DC Jack Replacement</Link>
            <Link href="/services" className="footer-link">Motherboard Chip-Level BGA</Link>
            <Link href="/services" className="footer-link">Deep Cleaning & Thermal Repaste</Link>
            <Link href="/track" className="footer-link">Track Your Repair Job Card</Link>
          </div>
        </div>

        {/* Shop Owner Portal & Support */}
        <div>
          <h4 className="footer-heading">Shop Management</h4>
          <div className="footer-links">
            <Link 
              href="/admin" 
              className="footer-link" 
              style={{ color: '#fbbf24', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Settings size={15} /> ⚙️ Shop Owner Portal
            </Link>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '-4px', marginBottom: '8px' }}>
              Update daily prices, stock, and shop profile
            </div>
            <Link href="/track" className="footer-link">Track Order Status</Link>
            <Link href="/cart" className="footer-link">View Cart & Checkout</Link>
            
            <div style={{ marginTop: '16px', padding: '14px', background: '#1e293b', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 700, marginBottom: '4px' }}>
                Need Urgent Repair in Hindupur?
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                Contact Azeez / Smartech workbench directly:
              </div>
              <a 
                href={`tel:${shopSettings.primaryPhone}`} 
                style={{ 
                  display: 'inline-block',
                  background: '#2563eb', 
                  color: 'white', 
                  padding: '6px 14px', 
                  borderRadius: '6px', 
                  fontSize: '0.85rem', 
                  fontWeight: 800,
                  textDecoration: 'none'
                }}
              >
                Call: {shopSettings.primaryPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div>
            © {new Date().getFullYear()} {shopSettings.storeName}. {shopSettings.locationDetails}, {shopSettings.streetDetails}, {shopSettings.city} - {shopSettings.pincode}.
          </div>
          <div className="footer-bottom-links">
            <Link href="/services">Warranty Policy</Link>
            <Link href="/services">Home Service Terms</Link>
            <Link href="/admin">Owner Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
