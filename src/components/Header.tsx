'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import EnterpriseAuthModal from './EnterpriseAuthModal';
import { 
  Laptop, 
  Search, 
  MessageSquare, 
  Wrench, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Home, 
  CheckCircle2, 
  X, 
  Menu, 
  Clock,
  Sparkles,
  Settings,
  Lock,
  User,
  LogOut
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const { 
    products, 
    shopSettings, 
    isOwnerAuthenticated,
    currentUser,
    userRole,
    logoutUser,
    isAuthModalOpen,
    authModalDefaultRole,
    openAuthModal,
    closeAuthModal
  } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || 'all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      router.push('/products');
      return;
    }
    router.push(`/products?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
    setSearchFocused(false);
  };

  // Discrete Owner Portal Shortcut: Ctrl + Shift + A (or Ctrl + Shift + O)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Search autocomplete suggestions
  const searchSuggestions = searchTerm.trim().length > 1
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <>
      <header className="header">
        {/* Top Announcement Bar with Real Shop Details */}
        <div className="header-top">
          <div className="header-top-content">
            <div className="header-top-left">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--accent)' }} /> 
                {shopSettings.timings}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} style={{ color: '#60a5fa' }} />
                {shopSettings.locationDetails} ({shopSettings.streetDetails})
              </span>
              <a 
                href={`tel:${shopSettings.primaryPhone}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#86efac', fontWeight: 700 }}
              >
                <PhoneCall size={14} /> 
                Call: {shopSettings.primaryPhone} / {shopSettings.secondaryPhone}
              </a>
            </div>
            <div className="header-top-right">
              <a 
                href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Smartech%20Computers,%20I%20am%20inquiring%20about%20products%20and%20repair`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#4ade80', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                💬 WhatsApp Order
              </a>
              <span style={{ opacity: 0.4 }}>|</span>
              <Link href="/services">In-Shop Repair Services</Link>
              <span style={{ opacity: 0.4 }}>|</span>
              <Link href="/track">Track Repair / Order</Link>
              <span style={{ opacity: 0.4 }}>|</span>
              {currentUser ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#93c5fd', fontWeight: 600 }}>
                  <User size={12} /> {currentUser.name.split(' ')[0]} ({currentUser.role})
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('customer')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e2e8f0',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                    fontSize: 'inherit'
                  }}
                >
                  <User size={12} /> Sign In
                </button>
              )}
              {isOwnerAuthenticated && currentUser?.email.toLowerCase() === 'azeez@smartechcomputers.com' && (
                <>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <Link 
                    href="/admin" 
                    style={{ 
                      background: 'linear-gradient(135deg, #10b981, #059669)', 
                      color: 'white', 
                      padding: '3px 10px', 
                      borderRadius: '4px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  >
                    <ShieldCheck size={13} /> Owner Mode Active
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="header-main">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo with Stylized Smartech Swirl */}
          <Link href="/" className="logo">
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb, #1e40af)' }}>
              {/* Stylized Double-S Monogram */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6C18 4.34315 16.6569 3 15 3H9C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9H15C16.6569 9 18 10.3431 18 12C18 13.6569 16.6569 15 15 15H9C7.34315 15 6 16.3431 6 18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="2" fill="#facc15" />
              </svg>
            </div>
            <div>
              <span style={{ color: 'var(--secondary)', letterSpacing: '-0.02em' }}>SMARTECH</span>
              <span style={{ color: 'var(--primary)', marginLeft: '3px' }}>COMPUTERS</span>
              <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--gray-500)', letterSpacing: '0.04em' }}>
                HINDUPUR • NEAR SHILPA HOSPITAL • RPGT ROAD
              </span>
            </div>
          </Link>

          {/* Physical Showroom Location Pill */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              textAlign: 'left', 
              padding: '6px 12px', 
              background: 'var(--gray-100)', 
              borderRadius: 'var(--radius-md)' 
            }}
          >
            <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--gray-500)', lineHeight: 1 }}>Walk-In Showroom</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-800)', lineHeight: 1.2 }}>
                RPGT Road, Hindupur
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="search-bar">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter Search by Category"
              >
                <option value="all">All Items</option>
                <option value="accessories">Keyboards & Accessories</option>
                <option value="laptops">Refurbished Laptops</option>
                <option value="desktops">Gaming & Desktops</option>
                <option value="components">Consistent SSDs & RAM</option>
                <option value="monitors">Monitors</option>
              </select>
              <input
                type="text"
                placeholder="Search PARADOX keyboard, Dell, ThinkPad, SSD, screen repair..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <Search size={18} />
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {searchFocused && searchSuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '6px',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--gray-200)',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '8px 14px', background: 'var(--gray-50)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)' }}>
                  MATCHING SMARTECH INVENTORY ({searchSuggestions.length})
                </div>
                {searchSuggestions.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--gray-100)',
                      color: 'var(--gray-800)',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '4px', background: 'var(--gray-100)' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        <span className={`badge ${item.conditionGrade === 'Grade A+' ? 'badge-success' : 'badge-primary'}`} style={{ marginRight: '6px', fontSize: '0.65rem' }}>
                          {item.conditionGrade}
                        </span>
                        {item.brand} • {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--secondary)' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textDecoration: 'line-through' }}>
                        ₹{item.mrp.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <Link 
              href="/services" 
              className="btn btn-sm btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderColor: 'var(--primary)' }}
            >
              <Wrench size={16} />
              <span>Repair Services</span>
            </Link>

            {/* Customer Account Button */}
            {currentUser ? (
              <div style={{ position: 'relative' }}>
                <button 
                  type="button"
                  className="header-action-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Account Settings"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    background: currentUser.role === 'owner' ? '#fef3c7' : '#f0fdf4',
                    border: currentUser.role === 'owner' ? '1px solid #fde68a' : '1px solid #bbf7d0',
                    padding: '4px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span className="icon" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={18} style={{ color: currentUser.role === 'owner' ? '#b45309' : '#15803d' }} />
                  </span>
                  <span className="label" style={{ fontWeight: 800, color: 'var(--gray-900)', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '115%',
                      right: 0,
                      width: '240px',
                      background: 'white',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--gray-200)',
                      zIndex: 2000,
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '8px' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--gray-900)' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--gray-500)', wordBreak: 'break-all' }}>{currentUser.email}</div>
                      <div style={{ marginTop: '4px' }}>
                        <span className={`badge ${currentUser.role === 'owner' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                          {currentUser.role === 'owner' ? '👑 Store Owner' : '🛍️ Verified Customer'}
                        </span>
                      </div>
                    </div>

                    {currentUser.role === 'owner' && currentUser.email.toLowerCase() === 'azeez@smartechcomputers.com' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          background: '#fef3c7',
                          color: '#92400e',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <ShieldCheck size={16} /> Owner Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/track"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--gray-700)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <Clock size={16} /> Track In-Shop Job Cards
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logoutUser();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--gray-50)',
                        color: '#dc2626',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                type="button"
                className="header-action-btn"
                onClick={() => openAuthModal('customer')}
                aria-label="Customer Sign In"
              >
                <span className="icon">
                  <User size={22} />
                </span>
                <span className="label">Sign In</span>
              </button>
            )}

            <a 
              href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Smartech%20Computers,%20I%20am%20interested%20in%20visiting%20your%20RPGT%20Road%20showroom.`}
              target="_blank"
              rel="noreferrer"
              className="header-action-btn"
              style={{ textDecoration: 'none' }}
              title="Chat with shop on WhatsApp"
            >
              <span className="icon" style={{ color: '#16a34a' }}>
                <MessageSquare size={20} />
              </span>
              <span className="label" style={{ color: '#16a34a', fontWeight: 700 }}>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Categories Navigation Bar */}
        <nav className="header-nav">
          <div className="nav-content">
            <Link 
              href="/products" 
              className={`nav-link ${pathname === '/products' && !currentCategory ? 'active' : ''}`}
            >
              All Showroom Stock
            </Link>
            <Link 
              href="/products?category=accessories" 
              className={`nav-link ${pathname === '/products' && currentCategory === 'accessories' ? 'active' : ''}`}
            >
              PARADOX & Accessories
            </Link>
            <Link 
              href="/products?category=laptops" 
              className={`nav-link ${pathname === '/products' && currentCategory === 'laptops' ? 'active' : ''}`}
            >
              Refurbished Laptops
            </Link>
            <Link 
              href="/products?category=desktops" 
              className={`nav-link ${pathname === '/products' && currentCategory === 'desktops' ? 'active' : ''}`}
            >
              Gaming & Tower PCs
            </Link>
            <Link 
              href="/products?category=components" 
              className={`nav-link ${pathname === '/products' && currentCategory === 'components' ? 'active' : ''}`}
            >
              Consistent SSDs & RAM
            </Link>
            <Link 
              href="/products?category=monitors" 
              className={`nav-link ${pathname === '/products' && currentCategory === 'monitors' ? 'active' : ''}`}
            >
              Monitors
            </Link>
            <Link 
              href="/services" 
              className={`nav-link nav-link-highlight ${pathname === '/services' ? 'active' : ''}`} 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Wrench size={15} /> In-Shop Repair Lab (Hindupur)
            </Link>
            <Link 
              href="/track" 
              className={`nav-link ${pathname === '/track' ? 'active' : ''}`} 
              style={{ marginLeft: 'auto' }}
            >
              Track Repair / Order
            </Link>
            <Link 
              href="/admin" 
              className={`nav-link ${pathname === '/admin' || pathname === '/owner' ? 'active' : ''}`} 
              style={{ color: isOwnerAuthenticated ? '#059669' : '#d97706', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              {isOwnerAuthenticated ? <ShieldCheck size={14} /> : <Lock size={14} />} 
              {isOwnerAuthenticated ? 'Owner Hub' : 'Owner Login'}
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo">
            <div className="logo-icon" style={{ background: 'var(--primary)' }}>
              <Laptop size={20} />
            </div>
            <div>
              <strong>SMARTECH COMPUTERS</strong>
              <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>Hindupur</div>
            </div>
          </div>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="mobile-search">
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="search-bar">
            <input
              type="text"
              placeholder="Search products or repair..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>
        </div>

        <nav>
          {currentUser ? (
            <div style={{ margin: '12px 0', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <User size={18} style={{ color: currentUser.role === 'owner' ? '#b45309' : 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{currentUser.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="btn btn-sm btn-outline"
                style={{ width: '100%', marginTop: '8px', color: '#dc2626', borderColor: '#fca5a5' }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('customer');
              }}
              className="btn btn-sm btn-primary"
              style={{ width: '100%', margin: '12px 0' }}
            >
              <User size={16} /> Customer Sign In / Register
            </button>
          )}

          <Link href="/" className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Home Showroom</Link>
          <Link href="/products" className={`mobile-nav-link ${pathname === '/products' && !currentCategory ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>All Products Catalog</Link>
          <Link href="/products?category=accessories" className={`mobile-nav-link ${pathname === '/products' && currentCategory === 'accessories' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Consistent PARADOX & Accessories</Link>
          <Link href="/products?category=laptops" className={`mobile-nav-link ${pathname === '/products' && currentCategory === 'laptops' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Refurbished Laptops (Dell/ThinkPad/HP)</Link>
          <Link href="/products?category=desktops" className={`mobile-nav-link ${pathname === '/products' && currentCategory === 'desktops' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Custom Gaming & Office Desktops</Link>
          <Link href="/products?category=components" className={`mobile-nav-link ${pathname === '/products' && currentCategory === 'components' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Consistent SSDs & RAM Upgrades</Link>
          <Link href="/products?category=monitors" className={`mobile-nav-link ${pathname === '/products' && currentCategory === 'monitors' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Monitors & Displays</Link>
          <Link href="/services" className={`mobile-nav-link ${pathname === '/services' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700 }}>
            🔧 In-Shop Repair Services
          </Link>
          <Link href="/track" className={`mobile-nav-link ${pathname === '/track' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Track Status</Link>
          {isOwnerAuthenticated && currentUser?.email.toLowerCase() === 'azeez@smartechcomputers.com' && (
            <Link href="/admin" className={`mobile-nav-link ${pathname === '/admin' || pathname === '/owner' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} style={{ color: '#10b981', fontWeight: 800 }}>
              🛡️ Owner Management Dashboard
            </Link>
          )}
        </nav>
      </div>



      {/* Enterprise Authentication & Password Recovery Dialog */}
      <EnterpriseAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        defaultRole={authModalDefaultRole} 
      />
    </>
  );
}
