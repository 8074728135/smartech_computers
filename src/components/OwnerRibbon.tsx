'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { 
  ShieldCheck, 
  Eye, 
  Sliders, 
  PlusCircle, 
  LogOut, 
  Store,
  ExternalLink,
  Tag
} from 'lucide-react';

export default function OwnerRibbon() {
  const { isOwnerAuthenticated, userRole, toggleUserRole, ownerLogout, currentUser } = useShop();
  const pathname = usePathname();
  const router = useRouter();

  // If not logged in as the verified owner (Azeez), render nothing (customers see zero admin clutter)
  if (!isOwnerAuthenticated || currentUser?.email.toLowerCase() !== 'azeez@smartechcomputers.com') {
    return null;
  }

  const isInAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/owner');

  return (
    <aside 
      aria-label="Owner Administration Bar"
      style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
        color: '#f8fafc',
        borderBottom: '1px solid #334155',
        fontSize: '0.8rem',
        padding: '6px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}
    >
      {/* Left: Identity Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span 
          style={{ 
            background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
            color: '#ffffff', 
            fontWeight: 800, 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontSize: '0.72rem',
            letterSpacing: '0.04em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          👑 OWNER ACTIVE
        </span>
        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
          Smartech Computers (Azeez)
        </span>
        <span style={{ color: '#64748b' }}>•</span>
        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
          Hindupur Store Control
        </span>
      </div>

      {/* Center: Real-Time Role & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginRight: '4px' }}>
          Current View:
        </span>

        {/* View as Customer Pill */}
        <button
          onClick={() => {
            if (userRole !== 'customer') toggleUserRole();
            if (isInAdminPage) router.push('/products');
          }}
          style={{
            background: userRole === 'customer' && !isInAdminPage ? '#2563eb' : '#334155',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '3px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease'
          }}
          title="Browse the catalog exactly as customers in Hindupur see it"
        >
          <Eye size={13} /> Customer View
        </button>

        {/* View as Owner / Admin Pill */}
        <Link
          href="/admin"
          onClick={() => {
            if (userRole !== 'owner') toggleUserRole();
          }}
          style={{
            background: isInAdminPage || userRole === 'owner' ? '#10b981' : '#334155',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '3px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
          title="Open daily price editor and orders dashboard"
        >
          <Sliders size={13} /> Owner Dashboard
        </Link>
      </div>

      {/* Right: Quick Actions & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link
          href="/admin"
          style={{
            color: '#cbd5e1',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.06)',
            padding: '3px 8px',
            borderRadius: '4px'
          }}
        >
          <Tag size={13} color="#facc15" /> Daily Prices
        </Link>

        <button
          onClick={ownerLogout}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '4px',
            padding: '3px 9px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease'
          }}
          title="Log out and lock the owner portal"
        >
          <LogOut size={12} /> Lock / Exit
        </button>
      </div>
    </aside>
  );
}
