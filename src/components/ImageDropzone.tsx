'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Star, AlertCircle } from 'lucide-react';

interface ImageDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export default function ImageDropzone({ images, onChange, maxFiles = 6 }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    setErrorMessage('');
    const newFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Only image files (JPG, PNG, WebP, SVG) are accepted.');
        return false;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('File size exceeds 8MB limit.');
        return false;
      }
      return true;
    });

    if (newFiles.length === 0) return;

    if (images.length + newFiles.length > maxFiles) {
      setErrorMessage(`Maximum ${maxFiles} images allowed per product.`);
    }

    const filesToProcess = newFiles.slice(0, maxFiles - images.length);

    // Read all files as Base64 Data URLs
    const readPromises = filesToProcess.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises)
      .then(base64Images => {
        onChange([...images, ...base64Images]);
      })
      .catch(() => {
        setErrorMessage('Failed to read some image files. Please try again.');
      });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, i) => i !== index);
    onChange([item, ...filtered]);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = ''; // Reset so the same file can be re-selected if needed
        }}
        multiple
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        style={{ display: 'none' }}
      />

      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: isDragging ? '2px dashed #2563eb' : '2px dashed #cbd5e1',
          background: isDragging ? '#eff6ff' : '#f8fafc',
          borderRadius: '12px',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isDragging ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none'
        }}
      >
        <div 
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: isDragging ? '#dbeafe' : '#e2e8f0',
            color: isDragging ? '#2563eb' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}
        >
          <UploadCloud size={24} />
        </div>

        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
          {isDragging ? 'Drop your product photo here' : 'Drag & Drop product images here, or browse files'}
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          Direct photo upload from your computer or phone • PNG, JPG, WebP up to 8MB (No external link required)
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.8rem', marginTop: '8px' }}>
          <AlertCircle size={14} /> {errorMessage}
        </div>
      )}

      {/* Previews Grid */}
      {images.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Uploaded Product Photos ({images.length}/{maxFiles}):</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              + Add More Photos
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
            {images.map((imgSrc, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  border: idx === 0 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  overflow: 'hidden',
                  background: '#ffffff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                }}
              >
                <img
                  src={imgSrc}
                  alt={`Product view ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                />

                {/* Primary Badge */}
                {idx === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <Star size={10} fill="currentColor" /> Cover
                  </span>
                )}

                {/* Action buttons overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    display: 'flex',
                    gap: '4px'
                  }}
                >
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetPrimary(idx);
                      }}
                      title="Set as Main Cover Image"
                      style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Star size={12} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    title="Remove Photo"
                    style={{
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
