'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { REPAIR_SERVICES } from '@/lib/initialData';
import { 
  Wrench, 
  Home, 
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
  MessageSquare
} from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const { createServiceBooking, userPincode, checkDelivery, shopSettings, showToast } = useShop();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-1');
  const [serviceMode, setServiceMode] = useState<'home_visit' | 'shop_dropoff'>('home_visit');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState(userPincode || '515201');
  const [deviceType, setDeviceType] = useState<'Laptop' | 'Desktop PC' | 'Monitor' | 'Printer / Accessory' | 'Other'>('Laptop');
  const [deviceBrandModel, setDeviceBrandModel] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('2:00 PM - 5:00 PM');
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

    if (serviceMode === 'home_visit' && (!address || !pincode)) {
      showToast('Please provide your address and pincode in Hindupur for home visit.', 'error');
      return;
    }

    const booking = createServiceBooking({
      customerName,
      phone,
      email: email || `${phone}@customer.smartech.in`,
      address: serviceMode === 'home_visit' 
        ? address 
        : `Shop Drop-off: ${shopSettings.storeName}, ${shopSettings.streetDetails}, ${shopSettings.locationDetails}`,
      pincode: pincode || '515201',
      city: shopSettings.city || 'Hindupur',
      deviceType,
      deviceBrandModel,
      issueCategory: activeService.category,
      issueDescription: `[${activeService.title}] ${issueDescription}`,
      serviceMode,
      scheduledDate,
      timeSlot,
      estimatedCost: activeService.startingPrice
    });

    setSubmittedBooking(booking);
  };

  const pinStatus = checkDelivery(pincode);

  return (
    <div className="services-page container">
      {/* Services Hero Header */}
      <div className="services-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '999px', fontSize: '0.85rem', color: '#93c5fd', marginBottom: '16px' }}>
          <Sparkles size={16} /> {shopSettings.storeName} • Certified Repair Lab & Home Service
        </div>
        <h1>Computer, Laptop & Accessory Repair</h1>
        <p>
          Drop off at our <strong>RPGT Road workbench (Near Shilpa Hospital, Hindupur)</strong> or <strong>book our senior technician for Doorstep Home Visit</strong> anywhere in Hindupur, Lepakshi, Chilamathur, and Penukonda.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
          <a href="#booking-wizard" className="btn btn-primary btn-lg">
            <Calendar size={18} /> Schedule Repair Appointment
          </a>
          <a href={`tel:${shopSettings.primaryPhone}`} className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <PhoneCall size={18} /> Urgent Helpline: {shopSettings.primaryPhone}
          </a>
        </div>
      </div>

      {/* Mode Benefits Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--white)', border: '2px solid #2563eb', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>Doorstep Home Service</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 800 }}>ACTIVE ACROSS HINDUPUR</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            Our technician visits your home or office with diagnostic tools and replacement parts. Ideal for heavy desktop PC towers, broken laptop screens, battery swaps, and SSD speed upgrades.
          </p>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
            ✓ Base visit fee: ₹299 (Waived on service approval)
          </div>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>Smartech Shop Drop-Off</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 800 }}>RPGT ROAD, NEAR SHILPA HOSPITAL</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            Bring your laptop directly to our workbench in Hindupur. Quick 15-minute diagnosis in front of you. Equipped with BGA rework stations and oscilloscopes for complex dead motherboard repairs.
          </p>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700 }}>
            ✓ Free 15-minute workbench diagnosis
          </div>
        </div>
      </div>

      {/* Services Catalog */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px' }}>
          <h2 className="section-title">Common Repair & Upgrade Services</h2>
          <p style={{ color: 'var(--gray-500)' }}>Select any service to pre-fill your booking form below</p>
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
                {srv.homeVisitEligible ? (
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    <Home size={12} style={{ display: 'inline', marginRight: '3px' }} /> Home Visit OK
                  </span>
                ) : (
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Lab Only</span>
                )}
              </div>

              <h3 style={{ marginTop: '14px' }}>{srv.title}</h3>
              <p>{srv.description}</p>

              {/* Symptoms */}
              <div style={{ margin: '14px 0', borderTop: '1px solid var(--gray-100)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Common Signs:
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
                {selectedServiceId === srv.id ? 'Selected in Form' : 'Book This Service'}
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
              Appointment Confirmed with {shopSettings.storeName}!
            </h2>
            <div style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 16px', fontFamily: 'var(--font-mono)' }}>
              Job Card No: #{submittedBooking.bookingNumber}
            </div>
            <p style={{ color: 'var(--gray-600)', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Thank you, <strong>{submittedBooking.customerName}</strong>. {shopSettings.ownerName} or our senior repair coordinator will contact you at <strong>{submittedBooking.phone}</strong> to confirm your technician visit for {submittedBooking.scheduledDate} ({submittedBooking.timeSlot}).
            </p>

            <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', maxWidth: '500px', margin: '0 auto 28px', padding: '20px', textAlign: 'left', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '8px' }}><strong>Service Mode:</strong> {submittedBooking.serviceMode === 'home_visit' ? '🏠 Doorstep Home Service' : '🏪 Shop Drop-Off'}</div>
              <div style={{ marginBottom: '8px' }}><strong>Device:</strong> {submittedBooking.deviceType} ({submittedBooking.deviceBrandModel})</div>
              <div style={{ marginBottom: '8px' }}><strong>Address:</strong> {submittedBooking.address}</div>
              <div style={{ marginBottom: '8px' }}><strong>Slot:</strong> {submittedBooking.scheduledDate} at {submittedBooking.timeSlot}</div>
              <div><strong>Initial Estimate:</strong> ₹{submittedBooking.estimatedCost.toLocaleString('en-IN')} (Parts confirmed on inspection)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a 
                href={`https://wa.me/91${shopSettings.whatsappNumber}?text=Hi%20Smartech%20Computers,%20I%20have%20booked%20repair%20job%20card%20#${submittedBooking.bookingNumber}%20for%20my%20${encodeURIComponent(submittedBooking.deviceBrandModel)}.%20Please%20confirm%20technician.`}
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
                Book Another Device
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2>Book Repair or Home Visit in Hindupur</h2>
                <p>
                  Selected service: <strong style={{ color: 'var(--primary)' }}>{activeService.title}</strong> (Starts from ₹{activeService.startingPrice})
                </p>
              </div>

              {/* Service Mode Selector Buttons */}
              <div style={{ display: 'flex', background: 'var(--gray-100)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                <button
                  type="button"
                  onClick={() => setServiceMode('home_visit')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: serviceMode === 'home_visit' ? 'var(--primary)' : 'transparent',
                    color: serviceMode === 'home_visit' ? 'white' : 'var(--gray-600)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Home size={15} /> Home Visit (Hindupur)
                </button>
                <button
                  type="button"
                  onClick={() => setServiceMode('shop_dropoff')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: serviceMode === 'shop_dropoff' ? 'var(--secondary)' : 'transparent',
                    color: serviceMode === 'shop_dropoff' ? 'white' : 'var(--gray-600)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Wrench size={15} /> Drop at RPGT Road Shop
                </button>
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

              {/* Conditional Address if Home Visit */}
              {serviceMode === 'home_visit' && (
                <>
                  <div className="input-group full-width">
                    <label className="input-label">Home / Office Address for Technician Visit *</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Door No, Street Name, Area/Colony, Landmark in Hindupur"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required={serviceMode === 'home_visit'}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Area Pincode *</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="515201"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      required={serviceMode === 'home_visit'}
                    />
                    {pinStatus && (
                      <span style={{ fontSize: '0.75rem', color: pinStatus.homeServiceAvailable ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
                        {pinStatus.homeServiceAvailable ? '✓ Same-Day Technician Visit Available' : '⚠️ Area outside normal dispatch; drop at shop recommended'}
                      </span>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email ID (for digital receipt)</label>
                    <input 
                      type="email" 
                      className="input" 
                      placeholder="customer@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="input-group">
                <label className="input-label">Preferred Date *</label>
                <input 
                  type="date" 
                  className="input" 
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Preferred Time Slot *</label>
                <select 
                  className="input"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="10:00 AM - 1:00 PM">Morning (10:00 AM – 1:00 PM)</option>
                  <option value="2:00 PM - 5:00 PM">Afternoon (2:00 PM – 5:00 PM)</option>
                  <option value="5:00 PM - 8:00 PM">Evening (5:00 PM – 8:00 PM)</option>
                </select>
              </div>

              <div className="input-group full-width">
                <label className="input-label">Describe the Problem or Symptoms *</label>
                <textarea 
                  className="input" 
                  placeholder="e.g. Screen has black lines, fan making loud noise, tea spilled on keyboard, laptop dead with no LED light..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                <CheckCircle2 size={20} /> 
                {serviceMode === 'home_visit' ? 'Confirm Home Service Booking' : 'Confirm Shop Drop-Off Slot'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
