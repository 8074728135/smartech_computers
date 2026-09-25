'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { UserRole } from '@/types';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Store,
  ShoppingBag
} from 'lucide-react';

interface EnterpriseAuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultRole?: UserRole;
  isStandaloneGate?: boolean;
}

export default function EnterpriseAuthModal({
  isOpen = true,
  onClose,
  defaultRole = 'customer',
  isStandaloneGate = false
}: EnterpriseAuthModalProps) {
  const { 
    loginWithEmail, 
    registerUser, 
    requestPasswordReset, 
    resetPasswordWithOtp,
    shopSettings 
  } = useShop();

  const [activeRole, setActiveRole] = useState<UserRole>(defaultRole);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-request' | 'forgot-verify' | 'forgot-success'>('login');

  // Synchronize activeRole with defaultRole whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveRole(defaultRole);
      if (defaultRole === 'owner') {
        setAuthMode('login');
      }
    }
  }, [isOpen, defaultRole]);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // STRICT OWNER RESTRICTION: Only 1 authorized owner email can log into owner portal
    if (activeRole === 'owner' && email.trim().toLowerCase() !== 'azeez@smartechcomputers.com') {
      setErrorMsg('Access Denied: Only the authorized shop owner can log into the Owner Portal. Customers cannot access store controls.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginWithEmail(email, password, activeRole);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        if (onClose) onClose();
      }
      setIsSubmitting(false);
    }, 250);
  };

  // Handle Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // STRICT PROTECTION: Owner registration is completely blocked
    if (activeRole === 'owner') {
      setErrorMsg('Owner registration is restricted. Only 1 designated shop owner account exists to prevent unauthorized access.');
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = registerUser({
        name,
        email,
        password,
        phone,
        role: 'customer'
      });

      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        if (onClose) onClose();
      }
      setIsSubmitting(false);
    }, 250);
  };

  // Handle Forgot Password - Step 1: Request OTP
  const handleForgotRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = requestPasswordReset(email);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setInfoMsg(`A 6-digit verification code has been sent to ${email.trim()}.`);
        setAuthMode('forgot-verify');
      }
      setIsSubmitting(false);
    }, 300);
  };

  // Handle Forgot Password - Step 2: Verify & Reset
  const handleForgotVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!otpInput.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg('Please fill in the OTP code and new password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = resetPasswordWithOtp(email, otpInput, password);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setAuthMode('forgot-success');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const cardContent = (
    <div 
      style={{
        width: '100%',
        maxWidth: '480px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: isStandaloneGate 
          ? '0 20px 40px -15px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)' 
          : '0 25px 50px -12px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header Card */}
      <div 
        style={{
          background: activeRole === 'owner' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' 
            : 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
          padding: '24px 24px 20px',
          color: '#ffffff',
          position: 'relative'
        }}
      >
        {!isStandaloneGate && onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: activeRole === 'owner' 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'linear-gradient(135deg, #38bdf8, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            {activeRole === 'owner' ? <Lock size={20} color="#ffffff" /> : <ShoppingBag size={20} color="#ffffff" />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              {activeRole === 'owner' ? 'Shop Owner Portal' : 'Customer Account'}
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              {activeRole === 'owner' 
                ? 'Single Authorized Owner Access • Smartech Computers' 
                : 'Smartech Computers • RPGT Road, Hindupur'}
            </div>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div 
          style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            padding: '3px',
            marginTop: '16px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveRole('customer');
              setErrorMsg('');
              setInfoMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeRole === 'customer' ? '#ffffff' : 'transparent',
              color: activeRole === 'customer' ? '#0f172a' : '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <ShoppingBag size={14} /> Customer Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('owner');
              if (authMode === 'signup') {
                setAuthMode('login');
              }
              setErrorMsg('');
              setInfoMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeRole === 'owner' ? '#f59e0b' : 'transparent',
              color: activeRole === 'owner' ? '#ffffff' : '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Lock size={14} /> Shop Owner Portal (1-Only)
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div style={{ padding: '24px' }}>
        
        {/* Single Owner Security Alert */}
        {activeRole === 'owner' && (
          <div 
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <ShieldCheck size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.78rem', color: '#1e40af', lineHeight: 1.45 }}>
              <strong>Single Owner Security:</strong> Only the verified store owner account has login privileges to protect shop prices and inventory from unauthorized modifications. Public registration for owner accounts is strictly disabled.
            </div>
          </div>
        )}
        
        {/* Error Alert */}
        {errorMsg && (
          <div 
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Info Alert */}
        {infoMsg && (
          <div 
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1: LOGIN                                                  */}
        {/* ============================================================== */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {activeRole === 'owner' ? 'Owner Email Address *' : 'Email Address *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder={activeRole === 'owner' ? "Enter authorized owner email" : "name@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Mail size={17} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {activeRole === 'owner' && (
                <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '4px' }}>
                  Restricted to authorized store owner account only.
                </div>
              )}
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot-request');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 40px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock size={17} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '8px',
                background: activeRole === 'owner' ? '#0f172a' : '#2563eb',
                borderColor: activeRole === 'owner' ? '#0f172a' : '#2563eb'
              }}
            >
              {isSubmitting ? 'Authenticating...' : `Sign In to ${activeRole === 'owner' ? 'Owner Portal' : 'Customer Account'}`}
            </button>

            {activeRole === 'owner' ? (
              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.82rem', color: '#64748b' }}>
                Are you a customer?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('customer');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Customer Sign In & Sign Up
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.82rem', color: '#64748b' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Sign Up as Customer
                </button>
              </div>
            )}
          </form>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: SIGN UP                                                */}
        {/* ============================================================== */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
                <User size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Phone Number (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
                <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Confirm *
                </label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                borderRadius: '8px',
                background: '#2563eb'
              }}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Customer Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.82rem', color: '#64748b' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                  setInfoMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: FORGOT PASSWORD - STEP 1 (REQUEST CODE)               */}
        {/* ============================================================== */}
        {authMode === 'forgot-request' && (
          <form onSubmit={handleForgotRequestSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                  setInfoMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0,
                  marginBottom: '12px',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                Reset Your Password
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                Enter the email address registered with your account. We will generate and send a 6-digit verification code.
              </p>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Registered Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
                <Mail size={17} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '8px'
              }}
            >
              {isSubmitting ? 'Sending Code...' : 'Send 6-Digit Verification Code'}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: FORGOT PASSWORD - STEP 2 (ENTER OTP & NEW PASSWORD)   */}
        {/* ============================================================== */}
        {authMode === 'forgot-verify' && (
          <form onSubmit={handleForgotVerifySubmit}>
            <div style={{ marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setAuthMode('forgot-request')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0,
                  marginBottom: '10px',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={14} /> Change Email
              </button>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
                Enter Verification Code & New Password
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Code sent to <strong>{email}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                6-Digit Verification Code *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 482910"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '8px',
                    border: '2px solid #2563eb',
                    fontSize: '1.1rem',
                    letterSpacing: '3px',
                    fontWeight: 800,
                    boxSizing: 'border-box'
                  }}
                />
                <KeyRound size={17} color="#2563eb" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  New Password *
                </label>
                <input
                  type="password"
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Confirm *
                </label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '8px',
                background: '#16a34a',
                borderColor: '#16a34a'
              }}
            >
              {isSubmitting ? 'Updating Password...' : 'Verify Code & Set New Password'}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* VIEW 5: FORGOT PASSWORD - STEP 3 (SUCCESS CONFIRMATION)       */}
        {/* ============================================================== */}
        {authMode === 'forgot-success' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div 
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Password Reset Complete!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.45 }}>
              Your account password has been updated securely. You can now sign in using your new password.
            </p>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setPassword('');
                setConfirmPassword('');
                setOtpInput('');
                setErrorMsg('');
                setInfoMsg('');
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 700 }}
            >
              Proceed to Sign In
            </button>
          </div>
        )}

        {/* Enterprise Security Footer */}
        <div 
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: '#94a3b8'
          }}
        >
          <ShieldCheck size={14} color="#059669" />
          <span>256-Bit SSL Encrypted Session • Smartech Enterprise Security</span>
        </div>
      </div>
    </div>
  );

  if (isStandaloneGate) {
    return (
      <div 
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 16px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)'
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      {cardContent}
    </div>
  );
}
