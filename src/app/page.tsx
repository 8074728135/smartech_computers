'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS } from '@/lib/initialData';
import { 
  Laptop, 
  Cpu, 
  Monitor, 
  HardDrive, 
  Headphones, 
  Wrench, 
  ShieldCheck, 
  Home, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Store,
  Star,
  Zap,
  Award,
  PhoneCall,
  MapPin,
  Settings,
  Flame
} from 'lucide-react';

export default function HomePage() {
  const { products, shopSettings } = useShop();

  // Flash Deals Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 10, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dailyDeals = products.filter(p => p.isDailyDeal).length > 0 
    ? products.filter(p => p.isDailyDeal) 
    : products;
  const featuredLaptops = products.filter(p => p.category === 'laptops').slice(0, 4);
  const accessoriesAndUpgrades = products.filter(p => p.category === 'components' || p.category === 'accessories').slice(0, 4);

  // Find featured product dynamically
  const paradoxProduct = products.find(p => p.id === 'prod-paradox');
  const featuredHeroProduct = paradoxProduct || products.find(p => p.isFeatured) || products[0];

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text animate-fade-in-up">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>{shopSettings.storeName} • {shopSettings.city}</span>
            </div>
            <h1>
              Refurbished Laptops & PCs. <br />
              <span className="highlight">All Accessories & In-Shop Repairs.</span>
            </h1>
            <p>
              Hindupur's premier computer hub for certified refurbished laptops, gaming desktop builds, NVMe SSD upgrades, genuine accessories, and chip-level repairs at our <strong>RPGT Road Workbench Lab</strong> near Shilpa Hospital.
            </p>

            <div className="hero-buttons">
              <Link href="/products" className="hero-btn-primary">
                Browse Stock & Offers <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="hero-btn-secondary">
                <Wrench size={18} /> In-Shop Repair Services
              </Link>
            </div>

            {/* Live Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">5,200+</div>
                <div className="hero-stat-label">Systems Serviced in Hindupur</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">1 Year</div>
                <div className="hero-stat-label">Warranty Support</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">In-Shop</div>
                <div className="hero-stat-label">Workbench Diagnostic Lab</div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Float Cards */}
          <div className="hero-visual animate-fade-in">
            <div style={{ position: 'relative', width: '380px', height: '400px' }}>
              {/* Highlight Featured Product */}
              {featuredHeroProduct && (
                <div className="hero-float-card" style={{ top: '0px', left: '0px', background: 'rgba(15, 23, 42, 0.85)', border: '2px solid #3b82f6', maxWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge" style={{ background: '#ef4444', color: 'white', fontWeight: 800, fontSize: '0.65rem' }}>
                      <Flame size={12} style={{ display: 'inline', marginRight: '2px' }} /> HOT OFFER
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#93c5fd', fontWeight: 700 }}>
                      {featuredHeroProduct.brand.toUpperCase()} • {featuredHeroProduct.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="card-title" style={{ fontSize: '1.05rem', color: 'white' }}>{featuredHeroProduct.title}</div>
                  <div className="card-desc" style={{ color: '#cbd5e1' }}>
                    {featuredHeroProduct.shortSpecs?.slice(0, 3).join(' • ') || featuredHeroProduct.description.slice(0, 60)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#facc15' }}>₹{featuredHeroProduct.price.toLocaleString('en-IN')}</span>
                    {featuredHeroProduct.mrp > featuredHeroProduct.price && (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{featuredHeroProduct.mrp.toLocaleString('en-IN')}</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 800 }}>{featuredHeroProduct.discountPercent}% OFF</span>
                  </div>
                </div>
              )}

              {/* In-Shop Workbench Badge */}
              <div className="hero-float-card" style={{ bottom: '15px', right: '10px' }}>
                <div className="card-icon" style={{ color: '#34d399' }}><Wrench size={30} /></div>
                <div className="card-title">RPGT Road Workbench</div>
                <div className="card-desc">Bring damaged laptops & PCs for free 15-min inspection</div>
                <div style={{ marginTop: '6px', fontSize: '0.85rem', color: '#6ee7b7', fontWeight: 800 }}>🤝 Price is Negotiable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POSTER BANNER: FEATURED PARADOX SHOWCASE (ONLY IF IN STOCK) ===== */}
      {paradoxProduct && (
        <section style={{ background: 'linear-gradient(135deg, #090d16 0%, #172554 50%, #1e3a8a 100%)', padding: '36px 0', borderBottom: '2px solid #2563eb' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', position: 'relative' }}>
                  <img 
                    src={paradoxProduct.image} 
                    alt="Consistent PARADOX Gaming Wired Keyboard" 
                    style={{ maxHeight: '240px', objectFit: 'contain', margin: '0 auto', filter: 'drop-shadow(0 15px 25px rgba(37,99,235,0.4))' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-accent" style={{ fontSize: '0.75rem', fontWeight: 800 }}>BEST PRICE OFFER!</span>
                  <span className="badge badge-danger" style={{ fontSize: '0.75rem', fontWeight: 800 }}>LIMITED STOCK AVAILABLE!</span>
                </div>

                <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '6px' }}>
                  PARADOX <span style={{ color: '#60a5fa', fontSize: '1.3rem', fontWeight: 600 }}>Gaming Wired Keyboard</span>
                </h2>
                <div style={{ fontSize: '1rem', fontStyle: 'italic', color: '#facc15', fontWeight: 700, marginBottom: '14px' }}>
                  "Shock the game, Break the locks"
                </div>

                {/* 5 Icons from Poster */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: 800 }}>19 Keys</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Anti-Ghosting</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.9rem', color: '#f43f5e', fontWeight: 800 }}>RGB</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Fixed Light</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.9rem', color: '#eab308', fontWeight: 800 }}>87 Keys</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Multimedia</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.9rem', color: '#22c55e', fontWeight: 800 }}>Windows</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Lock Key</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.9rem', color: '#a855f7', fontWeight: 800 }}>Type-C</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Interface</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#facc15', fontFamily: 'var(--font-mono)' }}>₹1,299</span>
                    <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>₹2,499</span>
                  </div>
                  <Link href={`/products/${paradoxProduct.id}`} className="btn btn-primary" style={{ background: '#2563eb', padding: '12px 24px', fontWeight: 800 }}>
                    View Specs & Showroom Stock →
                  </Link>
                  <a 
                    href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Smartech%20Computers,%20I%20want%20to%20buy%20the%20Consistent%20PARADOX%20Gaming%20Keyboard`}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{ color: '#4ade80', borderColor: '#4ade80' }}
                  >
                    WhatsApp: {shopSettings.primaryPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== CATEGORIES GRID ===== */}
      <section className="section" style={{ padding: '50px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>Select what you need: Certified refurbished systems, accessories, upgrades, or in-shop workbench repairs in Hindupur</p>
            </div>
            <Link href="/products" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Showroom Stock <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-grid">
            <Link href="/products?category=accessories" className="category-card">
              <div className="category-icon printers">
                <Headphones size={32} style={{ color: '#9333ea' }} />
              </div>
              <span className="category-name">PARADOX & Accessories</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Keyboards, Chargers, Mice</span>
            </Link>

            <Link href="/products?category=laptops" className="category-card">
              <div className="category-icon laptops">
                <Laptop size={32} style={{ color: '#2563eb' }} />
              </div>
              <span className="category-name">Refurbished Laptops</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Dell, ThinkPad, HP EliteBook</span>
            </Link>

            <Link href="/products?category=desktops" className="category-card">
              <div className="category-icon desktops">
                <Cpu size={32} style={{ color: '#7c3aed' }} />
              </div>
              <span className="category-name">Custom Gaming Desktops</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Ryzen Builds & Office PCs</span>
            </Link>

            <Link href="/products?category=components" className="category-card">
              <div className="category-icon components">
                <HardDrive size={32} style={{ color: '#d97706' }} />
              </div>
              <span className="category-name">Consistent SSDs & RAM</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Fast Boot Speed Upgrades</span>
            </Link>

            <Link href="/products?category=monitors" className="category-card">
              <div className="category-icon accessories">
                <Monitor size={32} style={{ color: '#059669' }} />
              </div>
              <span className="category-name">Monitors & Displays</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>IPS 75Hz LED Panels</span>
            </Link>

            <Link href="/services" className="category-card" style={{ borderColor: 'rgba(37,99,235,0.4)', background: '#eff6ff' }}>
              <div className="category-icon repair">
                <Wrench size={32} style={{ color: '#dc2626' }} />
              </div>
              <span className="category-name" style={{ color: 'var(--primary)', fontWeight: 800 }}>In-Shop Repair Lab</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>RPGT Road Workbench</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== DAILY FLASH DEALS SECTION (AMAZON / FLIPKART STYLE) ===== */}
      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container">
          {/* Flash Deals Header Banner */}
          <div className="deals-banner">
            <div className="deals-banner-text">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--secondary)', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                <Zap size={14} style={{ color: 'var(--accent)' }} /> Smartech Special Offers
              </div>
              <h3>Today's Featured Deals & Refurbished Systems</h3>
              <p>Hand-picked corporate stock tested on our RPGT Road workbench. Daily updated prices!</p>
            </div>

            <div className="deals-timer">
              <div className="timer-box">
                <div className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="timer-label">Hours</div>
              </div>
              <div className="timer-box">
                <div className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="timer-label">Mins</div>
              </div>
              <div className="timer-box">
                <div className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="timer-label">Secs</div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {dailyDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/products" className="btn btn-outline btn-lg">
              Explore All Showroom Inventory in Hindupur <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== IN-SHOP WORKBENCH REPAIR LAB SPOTLIGHT (RPGT ROAD, HINDUPUR) ===== */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', padding: '6px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
                <Wrench size={16} /> In-Shop Repair Lab • Near Shilpa Hospital, RPGT Road
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}>
                Damaged Laptop, Broken Screen or Dead PC? <br />
                <span style={{ color: '#60a5fa' }}>Bring It Directly to Our RPGT Road Workbench!</span>
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
                Bring your damaged laptop, desktop PC, monitor, or printer directly to our shop workbench in Hindupur. We inspect your device on our test bench right in front of you, give you a transparent diagnosis, and perform instant chip-level and part repairs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span style={{ fontSize: '0.95rem' }}><strong>Free 15-Minute Bench Diagnosis:</strong> Checked in front of you with zero hidden charges</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span style={{ fontSize: '0.95rem' }}><strong>Screen, Battery & Keyboard Swaps:</strong> Original parts fitted same-day at shop</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span style={{ fontSize: '0.95rem' }}><strong>BGA Chip-Level Motherboard Lab:</strong> Oscilloscopes and rework stations for dead systems</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span style={{ fontSize: '0.95rem' }}><strong>🤝 Price is Negotiable:</strong> Competitive, market-friendly prices negotiable at our counter!</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link href="/services" className="btn btn-primary btn-lg">
                  <Wrench size={18} /> Explore Repair Services & Rates
                </Link>
                <a href={`tel:${shopSettings.primaryPhone}`} className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                  <PhoneCall size={18} /> Call Workshop: {shopSettings.primaryPhone}
                </a>
              </div>
            </div>

            {/* Service Location Card */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-2xl)', padding: '36px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Smartech Computers Hindupur</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Near Shilpa Hospital, RPGT Road</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#94a3b8' }}>Store Timings:</span>
                  <strong>{shopSettings.timings}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#94a3b8' }}>Workbench Manager:</span>
                  <strong>Azeez ({shopSettings.ownerName})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#94a3b8' }}>Primary Phone:</span>
                  <strong>{shopSettings.primaryPhone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#94a3b8' }}>Secondary Phone:</span>
                  <strong>{shopSettings.secondaryPhone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Walk-In Service Location:</span>
                  <span style={{ textAlign: 'right', color: '#86efac', fontWeight: 700 }}>RPGT Road, Near Shilpa Hospital</span>
                </div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(37,99,235,0.2)', borderRadius: '10px', border: '1px solid rgba(96,165,250,0.3)', fontSize: '0.85rem', color: '#93c5fd', textAlign: 'center' }}>
                📍 <strong>Walk-In Workbench:</strong> Bring your damaged device with charger for instant on-the-spot testing.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REFURBISHED LAPTOPS SHOWCASE (ONLY IF IN STOCK) ===== */}
      {featuredLaptops.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
              <div>
                <div className="badge badge-primary" style={{ marginBottom: '8px' }}>Corporate Leased Refurbished</div>
                <h2 className="section-title">Tested Refurbished Business Laptops</h2>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>Dell Latitudes, Lenovo ThinkPads & HP EliteBooks with 1-Year Shop Warranty in Hindupur</p>
              </div>
              <Link href="/products?category=laptops" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All Laptops <ArrowRight size={16} />
              </Link>
            </div>

            <div className="products-grid">
              {featuredLaptops.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SHOP OWNER QUICK PORTAL BANNER (EXPLICIT USER REQUIREMENT) ===== */}
      <section style={{ background: '#fef3c7', borderTop: '2px solid #fde68a', borderBottom: '2px solid #fde68a', padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#92400e' }}>
                  Shop Owner Controls ({shopSettings.ownerName} / Smartech Admin)
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#b45309' }}>
                  Need to update today's prices, add new keyboards/laptops, or edit store phone numbers & address?
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/admin" className="btn btn-secondary btn-sm" style={{ background: '#78350f', color: 'white', padding: '10px 18px', fontWeight: 800 }}>
                Open Owner Daily Price & Settings Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
