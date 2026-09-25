'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { REPAIR_SERVICES } from '@/lib/initialData';
import { 
  Wrench, 
  MapPin, 
  Calendar, 
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
  Check
} from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const { createServiceBooking, shopSettings, showToast } = useShop();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-1');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deviceType, setDeviceType] = useState<'Laptop' | 'Desktop PC' | 'Monitor' | 'Printer / Accessory' | 'Other'>('Laptop');
  const [deviceBrandModel, setDeviceBrandModel] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (10:00 AM – 1:00 PM)');
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);

  const activeService = REPAIR_SERVICES.find(s => s.id === selectedServiceId) || REPAIR_SERVICES[0];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const target = document.getElementById('booking-wizard');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !deviceBrandModel || !issueDescription) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const booking = createServiceBooking({
      customerName,
      phone,
      email: email || `${phone}@customer.smartech.in`,
      address: `In-Shop Workbench: ${shopSettings.storeName}, ${shopSettings.streetDetails}, ${shopSettings.locationDetails}`,
      pincode: shopSettings.pincode || '515201',
      city: shopSettings.city || 'Hindupur',
      deviceType,
      deviceBrandModel,
      issueCategory: activeService.category,
      issueDescription: `[${activeService.title}] ${issueDescription}`,
      serviceMode: 'shop_dropoff',
      scheduledDate,
      timeSlot,
      estimatedCost: activeService.startingPrice
    });

    setSubmittedBooking(booking);
  };

  return (
    <div className="services-page container">
      {/* Services Hero Header */}
      <div className="services-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '999px', fontSize: '0.85rem', color: '#93c5fd', marginBottom: '16px' }}>
          <Sparkles size={16} /> {shopSettings.storeName} • In-Shop Workbench Repair Lab
        </div>
        <h1>Computer, Laptop & Hardware Repairs</h1>
        <p>
          Bring your damaged product directly to our shop workbench: <strong>Near Shilpa Hospital, RPGT Road, Hindupur</strong>. Instant on-the-spot inspection, transparent estimate, and genuine replacement parts.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
          <a href="#booking-wizard" className="btn btn-primary btn-lg">
            <Wrench size={18} /> Generate In-Shop Job Card
          </a>
          <a href={`tel:${shopSettings.primaryPhone}`} className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <PhoneCall size={18} /> Shop Workbench Call: {shopSettings.primaryPhone}
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
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>NEAR SHILPA HOSPITAL, RPGT ROAD</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            Visit our shop with your damaged laptop, desktop PC, monitor, or printer. All repairs are done in our dedicated workbench lab with direct technician access.
          </p>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
            ✓ Store Open: 9:30 AM – 9:30 PM (All 7 Days)
          </div>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>Free 15-Min Diagnosis</h3>
              <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 800 }}>FRONT-OF-DESK INSPECTION</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            We inspect your device on our test bench right in front of you. We verify motherboard power lines, test screen display cables, and give you an exact price quote before starting.
          </p>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700 }}>
            ✓ Zero hidden costs • Clear estimate upfront
          </div>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>Genuine Parts & Warranty</h3>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 800 }}>TESTED BENCH INVENTORY</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            Original Consistent SSDs, RAM modules, A+ grade IPS display panels, laptop batteries, and chargers kept in stock for instant same-day replacements.
          </p>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
            ✓ Warranty backed on all parts & labor
          </div>
        </div>
      </div>

      {/* Services Catalog */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px' }}>
          <h2 className="section-title">In-Shop Repair & Upgrade Services</h2>
          <p style={{ color: 'var(--gray-500)' }}>Select your required service below to pre-generate your workbench Job Card</p>
        </div>

        <div className="services-grid">
          {REPAIR_SERVICES.map((srv) => (
            <div 
              key={srv.id} 
              className="service-card"
              style={{
                borderColor: selectedServiceId === srv.id ? 'var(--primary)' : 'var(--gray-200)',
                background: selectedServiceId === srv.id ? '#f0f7ff' : 'var(--white)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge badge-primary">{srv.category}</span>
                {srv.sameDayRepair ? (
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    ⚡ Same-Day Workbench Fix
                  </span>
                ) : (
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                    🔬 Chip-Level Lab
                  </span>
                )}
              </div>

              <h3 style={{ marginTop: '14px' }}>{srv.title}</h3>
              <p>{srv.description}</p>

              {/* Symptoms */}
              <div style={{ margin: '14px 0', borderTop: '1px solid var(--gray-100)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Common Signs / Issues:
                </div>
                <ul style={{ fontSize: '0.8rem', color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {srv.commonIssues.slice(0, 2).map((issue, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 12px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Starts from:</div>
                  <div className="service-price" style={{ margin: 0, fontSize: '1.2rem' }}>
                    ₹{srv.startingPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Estimated Time:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-700)' }}>
                    {srv.turnaroundTime}
                  </div>
                </div>
              </div>

              <button 
                className={`btn ${selectedServiceId === srv.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleServiceSelect(srv.id)}
              >
                {selectedServiceId === srv.id ? 'Selected for Job Card' : 'Select Service'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Wizard */}
      <div id="booking-wizard" className="booking-section">
        {submittedBooking ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--secondary)' }}>
              In-Shop Repair Job Card Generated!
            </h2>
            <div style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 16px', fontFamily: 'var(--font-mono)' }}>
              Job Card No: #{submittedBooking.bookingNumber}
            </div>
            <p style={{ color: 'var(--gray-600)', maxWidth: '560px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Thank you, <strong>{submittedBooking.customerName}</strong>. Please bring your damaged device to our shop workbench: <strong>Smartech Computers, Near Shilpa Hospital, RPGT Road, Hindupur</strong>. Show this Job Card number at the counter for priority diagnosis.
            </p>

            <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', maxWidth: '520px', margin: '0 auto 28px', padding: '20px', textAlign: 'left', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '8px' }}><strong>Service Location:</strong> 🏪 In-Shop Drop-off (RPGT Road, Near Shilpa Hospital)</div>
              <div style={{ marginBottom: '8px' }}><strong>Shop Timings:</strong> Monday to Sunday: 9:30 AM – 9:30 PM</div>
              <div style={{ marginBottom: '8px' }}><strong>Device:</strong> {submittedBooking.deviceType} ({submittedBooking.deviceBrandModel})</div>
              <div style={{ marginBottom: '8px' }}><strong>Drop-off Target:</strong> {submittedBooking.scheduledDate} ({submittedBooking.timeSlot})</div>
              <div><strong>Initial Estimate:</strong> ₹{submittedBooking.estimatedCost.toLocaleString('en-IN')} (Parts confirmed on inspection)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a 
                href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Smartech%20Computers,%20I%20have%20registered%20in-shop%20repair%20Job%20Card%20#${submittedBooking.bookingNumber}%20for%20my%20${encodeURIComponent(submittedBooking.deviceBrandModel)}.%20I%20will%20bring%20it%20to%20the%20shop.`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ color: '#16a34a', borderColor: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MessageSquare size={16} /> Send to Smartech WhatsApp
              </a>
              <Link href="/track" className="btn btn-primary">
                Track Live Job Status
              </Link>
              <button 
                onClick={() => setSubmittedBooking(null)}
                className="btn btn-ghost"
              >
                Register Another Device
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2>Create In-Shop Repair Job Card</h2>
                <p>
                  Selected service: <strong style={{ color: 'var(--primary)' }}>{activeService.title}</strong> (Starts from ₹{activeService.startingPrice})
                </p>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 'var(--radius-md)', color: '#1e40af', fontSize: '0.85rem', fontWeight: 700 }}>
                <Store size={16} /> Walk-In Repair at RPGT Road Shop
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} className="booking-form" style={{ marginTop: '28px' }}>
              <div className="input-group">
                <label className="input-label">Your Full Name *</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. Ramesh Babu"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number (Calling / WhatsApp) *</label>
                <input 
                  type="tel" 
                  className="input" 
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Device Type *</label>
                <select 
                  className="input"
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value as any)}
                >
                  <option value="Laptop">Laptop (Dell, HP, Lenovo, Mac, Acer, etc.)</option>
                  <option value="Desktop PC">Desktop Tower / Gaming PC / All-in-One</option>
                  <option value="Monitor">Monitor / Display Panel</option>
                  <option value="Printer / Accessory">Printer / Accessory / Charger / Keyboard</option>
                  <option value="Other">Other Hardware Component</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Device Brand & Model *</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. Dell Inspiron 15, Lenovo ThinkPad, HP Pavilion"
                  value={deviceBrandModel}
                  onChange={(e) => setDeviceBrandModel(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Expected Drop-Off Date *</label>
                <input 
                  type="date" 
                  className="input" 
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Approximate Visit Time *</label>
                <select 
                  className="input"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
                  <option value="Afternoon (1:00 PM – 5:00 PM)">Afternoon (1:00 PM – 5:00 PM)</option>
                  <option value="Evening (5:00 PM – 9:00 PM)">Evening (5:00 PM – 9:00 PM)</option>
                  <option value="Walk-In Anytime (9:30 AM – 9:30 PM)">Walk-In Anytime (9:30 AM – 9:30 PM)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Email ID (Optional, for digital receipt)</label>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="customer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group full-width">
                <label className="input-label">Describe the Damaged Part or Problem *</label>
                <textarea 
                  className="input" 
                  placeholder="e.g. Screen has black lines, laptop not turning on, tea spilled on keyboard, fan making loud noise, hinges broken..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  required 
                />
              </div>

              <div className="full-width" style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}>
                📍 <strong>Shop Location:</strong> Smartech Computers, RPGT Road, Near Shilpa Hospital, Hindupur. Bring your damaged device with charger/power cord for accurate workbench testing.
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                <Wrench size={20} /> Generate In-Shop Repair Job Card
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
