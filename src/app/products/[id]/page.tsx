'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import { 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  Zap, 
  Star, 
  ChevronRight,
  Share2,
  Heart,
  Wrench,
  Check,
  Clock,
  PhoneCall,
  MessageSquare,
  Store
} from 'lucide-react';

import { INITIAL_PRODUCTS, AVAILABLE_SHOWROOM_TEMPLATES } from '@/lib/initialData';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, shopSettings, showToast } = useShop();

  const product = products.find(p => p.id === resolvedParams.id) 
    || INITIAL_PRODUCTS.find(p => p.id === resolvedParams.id) 
    || AVAILABLE_SHOWROOM_TEMPLATES.find(p => p.id === resolvedParams.id)
    || products[0] 
    || INITIAL_PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState<string>(product?.images?.[0] || product?.image || '');
  const [activeTab, setActiveTab] = useState<'specs' | 'condition' | 'reviews'>('specs');

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link href="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span className="separator"><ChevronRight size={14} /></span>
        <Link href="/products">Products</Link>
        <span className="separator"><ChevronRight size={14} /></span>
        <Link href={`/products?category=${product.category}`} style={{ textTransform: 'capitalize' }}>
          {product.category}
        </Link>
        <span className="separator"><ChevronRight size={14} /></span>
        <span className="current">{product.title.slice(0, 36)}...</span>
      </div>

      {/* Main Grid: Gallery + Purchasing Info */}
      <div className="product-detail-grid">
        {/* Left: Gallery & Badges */}
        <div className="product-gallery">
          <div className="product-main-image">
            <img 
              src={selectedImage || product.image} 
              alt={product.title} 
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="product-thumbnails">
              {product.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`product-thumb ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`View ${index + 1}`} />
                </div>
              ))}
            </div>
          )}

          {/* Trust Guarantees Box */}
          <div style={{ marginTop: '24px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '14px' }}>
              Why Buy This Certified Unit from Smartech Computers:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
                <span>1-Year Hardware Warranty</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} style={{ color: 'var(--success)' }} />
                <span>7 Days Replacement</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} style={{ color: '#d97706' }} />
                <span>Showroom Live Testing & Demo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={18} style={{ color: '#7c3aed' }} />
                <span>Free Data Transfer at Shop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Buy Box */}
        <div className="product-detail-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.brand} • SKU: {product.id.toUpperCase()}
            </span>
            <button 
              onClick={handleShare}
              style={{ background: 'var(--gray-100)', border: 'none', padding: '6px 12px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--gray-600)' }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>

          <h1>{product.title}</h1>

          {/* Rating & Grade Header */}
          <div className="product-detail-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', color: 'var(--accent)' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'var(--accent)' : 'none'} stroke="var(--accent)" />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.rating}</span>
              <span style={{ color: 'var(--gray-400)' }}>({product.reviewsCount} reviews)</span>
            </div>

            <span className={`badge ${product.conditionGrade === 'Grade A+' ? 'badge-success' : 'badge-primary'}`} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Refurbished Condition: {product.conditionGrade}
            </span>

            {product.stock > 0 ? (
              <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Store size={15} /> Available in Showroom ({product.stock} units left)
              </span>
            ) : (
              <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem' }}>
                ● Out of Stock at Store
              </span>
            )}
          </div>

          {/* Price Box */}
          <div className="product-detail-pricing">
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className="detail-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp > product.price && (
                <>
                  <span className="detail-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
                  <span className="detail-discount">{product.discountPercent}% OFF</span>
                </>
              )}
            </div>
            <div className="detail-tax-info">
              Inclusive of all taxes • You save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
            </div>
            {product.isNegotiable !== false && (
              <div style={{ marginTop: '6px', fontSize: '0.82rem', color: '#16a34a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                🤝 Price is Negotiable at Store Counter
              </div>
            )}
            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#1e40af', background: '#eff6ff', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={15} /> No Cost EMI starts from <strong>₹{Math.round(product.price / 6).toLocaleString('en-IN')}/month</strong>
            </div>
          </div>

          {/* Highlights */}
          <div className="product-highlights">
            <h3>Configuration Highlights</h3>
            <ul className="highlights-list">
              {product.shortSpecs.map((spec, i) => (
                <li key={i}>{spec}</li>
              ))}
            </ul>
          </div>

          {/* In-Store Showroom Availability & Direct Purchase */}
          <div style={{
            marginTop: '24px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '2px solid #bbf7d0',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ background: '#16a34a', color: 'white', borderRadius: '50%', padding: '8px', display: 'flex' }}>
                <Store size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#14532d' }}>
                  Walk-In Showroom & Direct In-Store Purchase
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#166534' }}>
                  Smartech Computers operates exclusively as an in-person physical showroom. No delivery waiting!
                </p>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', padding: '14px 16px', border: '1px solid #dcfce7', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <MapPin size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--gray-800)' }}>
                  <strong>Showroom Address:</strong> RPGT Road, Near Shilpa Hospital, Hindupur, Andhra Pradesh
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--gray-600)' }}>
                <Clock size={16} style={{ color: '#059669' }} />
                <span>Open Everyday: {shopSettings.timings || '10:00 AM - 9:00 PM'}</span>
              </div>
            </div>

            {/* In-Store Advantages */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', fontSize: '0.85rem', color: '#15803d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Live On-Desk Testing
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Instant Physical Handover
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Counter Price Negotiation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Free OS Setup & Assistance
              </div>
            </div>

            {/* Action Buttons: WhatsApp Inquiry and Direct Phone Call */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <a 
                href={`https://wa.me/91${shopSettings.whatsappNumber || '9030400551'}?text=Hi%20Smartech%20Computers,%20I%20am%20interested%20in%20visiting%20your%20Hindupur%20showroom%20to%20buy%20${encodeURIComponent(product.title)}%20(₹${product.price}).%20Is%20it%20available%20today?`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg"
                style={{
                  background: '#16a34a',
                  color: 'white',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <MessageSquare size={20} /> Inquire on WhatsApp
              </a>

              <a 
                href={`tel:${shopSettings.primaryPhone || '9030400551'}`}
                className="btn btn-outline btn-lg"
                style={{
                  borderColor: '#16a34a',
                  color: '#166534',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <PhoneCall size={18} /> Call Store
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications / Condition Report / Reviews */}
      <div style={{ marginTop: '60px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '36px' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid var(--gray-200)', gap: '32px', marginBottom: '28px' }}>
          <button 
            onClick={() => setActiveTab('specs')}
            style={{
              paddingBottom: '12px',
              fontSize: '1.05rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'specs' ? 'var(--primary)' : 'var(--gray-500)',
              borderBottom: activeTab === 'specs' ? '3px solid var(--primary)' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            Technical Specifications
          </button>
          <button 
            onClick={() => setActiveTab('condition')}
            style={{
              paddingBottom: '12px',
              fontSize: '1.05rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'condition' ? 'var(--primary)' : 'var(--gray-500)',
              borderBottom: activeTab === 'condition' ? '3px solid var(--primary)' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            Refurbished Condition Report ({product.conditionGrade})
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{
              paddingBottom: '12px',
              fontSize: '1.05rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--gray-500)',
              borderBottom: activeTab === 'reviews' ? '3px solid var(--primary)' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            Customer Reviews ({product.reviewsCount})
          </button>
        </div>

        {/* Tab 1: Specs Table */}
        {activeTab === 'specs' && (
          <div>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '24px' }}>
              {product.description}
            </p>
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Condition Report */}
        {activeTab === 'condition' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span className={`badge ${product.conditionGrade === 'Grade A+' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '1rem', padding: '6px 16px' }}>
                {product.conditionGrade}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>
                Detailed Workbench Inspection Report
              </span>
            </div>

            <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: 'var(--radius-lg)', marginBottom: '24px', border: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--gray-800)', lineHeight: 1.6 }}>
                {product.conditionSummary}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Display Panel
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                  Tested 100% pixel healthy. No backlight bleed or ghosting.
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Battery Health
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                  Original OEM battery cycle tested with over 85%+ life capacity.
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Thermals & Motherboard
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                  Cleaned, repasted with Arctic MX-4 paste. Stress tested for 2 hours.
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Keyboard & Ports
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                  All USB, Type-C, audio, and keyboard keys individually verified.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--gray-200)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--secondary)', lineHeight: 1 }}>{product.rating}</div>
                <div style={{ display: 'flex', color: 'var(--accent)', justifyContent: 'center', margin: '4px 0' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="var(--accent)" stroke="var(--accent)" />
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Based on {product.reviewsCount} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.8 }}>
                  ⭐ 98% of customers recommended this refurbished model.<br />
                  🛡️ Backed by TechCraft 1-Year Shop Replacement Warranty.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Venkatesh P. (Verified Buyer)</span>
                  <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>★★★★★</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                  "Phenomenal build quality! Boot speed with the NVMe SSD is under 10 seconds. The technician even cloned my old laptop hard disk files for free."
                </p>
              </div>

              <div style={{ padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Kavita Sundar (Verified Buyer)</span>
                  <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>★★★★★</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                  "Cosmetically looked brand new out of the box. No heating issues even after working 8 hours continuously on Excel and Zoom."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title">Similar Refurbished Systems</h2>
            <Link href={`/products?category=${product.category}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              View More in {product.category} →
            </Link>
          </div>
          <div className="products-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
