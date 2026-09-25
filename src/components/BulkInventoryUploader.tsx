'use client';

import React, { useState, useRef } from 'react';
import { useShop } from '@/context/ShopContext';
import { Product, ProductCategory, ConditionGrade } from '@/types';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  RefreshCw,
  Trash2,
  Package,
  Layers,
  Percent
} from 'lucide-react';

interface ParsedRow {
  title: string;
  brand: string;
  category: ProductCategory;
  conditionGrade: ConditionGrade;
  price: number;
  mrp: number;
  stock: number;
  shortSpecs: string[];
  warranty: string;
  valid: boolean;
  error?: string;
}

export default function BulkInventoryUploader() {
  const { products, bulkUpdateProducts, showToast } = useShop();

  const [isDragging, setIsDragging] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Multiplier state
  const [targetCategory, setTargetCategory] = useState<string>('all');
  const [priceAdjustmentPercent, setPriceAdjustmentPercent] = useState<number>(0);
  const [stockAddAmount, setStockAddAmount] = useState<number>(0);

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent = 
      'Title,Brand,Category,ConditionGrade,SellingPrice,OriginalMRP,StockUnits,KeySpecs,Warranty\n' +
      '"HP EliteBook 840 G5 Core i5 8th Gen 16GB 512GB SSD","HP","laptops","Grade A+","26999","75000","5","Intel Core i5 8th Gen, 16GB RAM, 512GB SSD, 14 inch FHD","1 Year Smartech Warranty"\n' +
      '"Consistent 1TB NVMe M.2 High Speed SSD Gen3","Consistent","components","Grade A+","4499","7999","20","Up to 2400MB/s Read, PCIe 3.0, 3D NAND","3 Years Brand Warranty"\n' +
      '"Dell OptiPlex 7050 Micro Core i7 16GB 512GB SSD","Dell","desktops","Grade A+","19499","58000","8","Intel Core i7 7th Gen, 16GB DDR4, Ultra Tiny Mini PC","1 Year Smartech Warranty"\n' +
      '"Consistent Mechanical RGB Gaming Keyboard PARADOX","Consistent","accessories","Grade A+","1299","2499","25","87 Keys TKL, RGB Light, Type-C Detachable","1 Year Consistent Warranty"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'smartech_bulk_inventory_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Smartech CSV Inventory Template!', 'success');
  };

  // Process CSV File
  const handleFileProcess = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setIsProcessing(false);
        return;
      }

      try {
        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          showToast('The uploaded CSV file is empty or missing data rows.', 'error');
          setIsProcessing(false);
          return;
        }

        // Parse CSV lines
        const rows: ParsedRow[] = [];
        // Skip header line 0
        for (let i = 1; i < lines.length; i++) {
          const raw = lines[i];
          // Regex to parse comma separated values handling quotes
          const matches = raw.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          
          let cols: string[] = [];
          if (matches) {
            cols = matches.map(c => c.replace(/^"|"$/g, '').trim());
          } else {
            cols = raw.split(',').map(c => c.replace(/^"|"$/g, '').trim());
          }

          if (cols.length < 5) continue;

          const title = cols[0] || '';
          const brand = cols[1] || 'Consistent';
          const cat = (cols[2] || 'accessories').toLowerCase() as ProductCategory;
          const grade = (cols[3] || 'Grade A+') as ConditionGrade;
          const price = Number(cols[4]) || 0;
          const mrp = Number(cols[5]) || price * 1.5;
          const stock = Number(cols[6]) || 1;
          const specsRaw = cols[7] || '';
          const warranty = cols[8] || '1 Year Smartech Warranty';

          const valid = title.length > 2 && price > 0 && stock >= 0;

          rows.push({
            title,
            brand,
            category: ['laptops', 'desktops', 'monitors', 'components', 'accessories'].includes(cat) ? cat : 'accessories',
            conditionGrade: ['Grade A+', 'Grade A', 'Grade B'].includes(grade) ? grade : 'Grade A+',
            price,
            mrp,
            stock,
            shortSpecs: specsRaw ? specsRaw.split(',').map(s => s.trim()) : ['Verified Quality', 'Tested OK'],
            warranty,
            valid,
            error: !valid ? 'Missing title or invalid price/stock' : undefined
          });
        }

        setParsedRows(rows);
        showToast(`Parsed ${rows.length} inventory records from ${file.name}`, 'info');
      } catch {
        showToast('Failed to parse file format. Please check the CSV structure.', 'error');
      }
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Commit valid rows to live store
  const handleCommitImport = () => {
    const validRows = parsedRows.filter(r => r.valid);
    if (validRows.length === 0) {
      showToast('No valid rows found to import.', 'error');
      return;
    }

    const defaultImages: Record<string, string> = {
      laptops: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      desktops: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
      components: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
      monitors: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
      accessories: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80'
    };

    const newProducts: Product[] = validRows.map((r, idx) => {
      const slug = r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const discountPercent = r.mrp > r.price ? Math.round(((r.mrp - r.price) / r.mrp) * 100) : 0;
      const img = defaultImages[r.category] || defaultImages.accessories;

      return {
        id: `prod-bulk-${Date.now().toString(36)}-${idx}`,
        title: r.title,
        slug,
        brand: r.brand,
        category: r.category,
        conditionGrade: r.conditionGrade,
        price: r.price,
        mrp: r.mrp,
        discountPercent,
        stock: r.stock,
        rating: 4.8,
        reviewsCount: 1,
        image: img,
        images: [img],
        warranty: r.warranty,
        shortSpecs: r.shortSpecs,
        specs: {
          'Brand': r.brand,
          'Condition': r.conditionGrade,
          'Warranty': r.warranty
        },
        description: `${r.title}. Available at Smartech Computers Hindupur with verified testing warranty.`,
        conditionSummary: `${r.conditionGrade} certified condition.`,
        isDailyDeal: false,
        isFeatured: false,
        updatedAt: new Date().toISOString()
      };
    });

    bulkUpdateProducts([...newProducts, ...products]);
    showToast(`Successfully added ${newProducts.length} products to live inventory!`, 'success');
    setParsedRows([]);
    setFileName('');
  };

  // Bulk Price Multiplier handler
  const handleApplyCategoryAdjustment = () => {
    if (priceAdjustmentPercent === 0 && stockAddAmount === 0) {
      showToast('Please specify a price % change or stock amount.', 'info');
      return;
    }

    const updated = products.map(p => {
      if (targetCategory !== 'all' && p.category !== targetCategory) {
        return p;
      }

      let newPrice = p.price;
      if (priceAdjustmentPercent !== 0) {
        newPrice = Math.round(p.price * (1 + priceAdjustmentPercent / 100));
        if (newPrice < 1) newPrice = p.price;
      }

      let newStock = p.stock;
      if (stockAddAmount !== 0) {
        newStock = Math.max(0, p.stock + stockAddAmount);
      }

      const discountPercent = p.mrp > newPrice ? Math.round(((p.mrp - newPrice) / p.mrp) * 100) : 0;

      return {
        ...p,
        price: newPrice,
        stock: newStock,
        discountPercent,
        updatedAt: new Date().toISOString()
      };
    });

    bulkUpdateProducts(updated);
    showToast(`Updated batch prices/stock across ${targetCategory === 'all' ? 'all categories' : targetCategory}!`, 'success');
    setPriceAdjustmentPercent(0);
    setStockAddAmount(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <span 
            style={{ 
              background: '#2563eb', 
              color: '#ffffff', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              padding: '3px 8px', 
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}
          >
            Owner Batch Center
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '8px 0 4px 0' }}>
            Bulk Inventory Upload & Data Management
          </h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
            Import spreadsheets from supplier invoices, upload CSVs, or adjust bulk category prices.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="btn btn-outline btn-sm"
          style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
        >
          <Download size={15} /> Download CSV Template
        </button>
      </div>

      {/* Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Column 1: CSV / Spreadsheet Dropzone */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: '#dcfce7', color: '#15803d', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                1. Upload Inventory CSV Spreadsheet
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Supports Excel export (.csv)
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileProcess(e.target.files[0]);
              }
              e.target.value = '';
            }}
          />

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragging ? '2px dashed #16a34a' : '2px dashed #cbd5e1',
              background: isDragging ? '#f0fdf4' : '#f8fafc',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <UploadCloud size={32} color={isDragging ? '#16a34a' : '#64748b'} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              {fileName ? `File: ${fileName}` : 'Drag & Drop your inventory .csv here'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              or click to browse from your device
            </div>
          </div>

          {parsedRows.length > 0 && (
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  Parsed Records ({parsedRows.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                  ✅ {parsedRows.filter(r => r.valid).length} Ready to Import
                </span>
              </div>

              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.78rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f1f5f9', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '6px 8px' }}>Item</th>
                      <th style={{ padding: '6px 8px' }}>Cat</th>
                      <th style={{ padding: '6px 8px' }}>Price</th>
                      <th style={{ padding: '6px 8px' }}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 8px', fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.title}
                        </td>
                        <td style={{ padding: '6px 8px', color: '#64748b' }}>{row.category}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700, color: '#2563eb' }}>₹{row.price}</td>
                        <td style={{ padding: '6px 8px' }}>{row.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleCommitImport}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, background: '#16a34a', borderColor: '#16a34a' }}
                >
                  <CheckCircle2 size={15} /> Import {parsedRows.filter(r => r.valid).length} Products Now
                </button>
                <button
                  type="button"
                  onClick={() => { setParsedRows([]); setFileName(''); }}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Bulk Category Price & Stock Adjuster */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: '#dbeafe', color: '#1d4ed8', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Percent size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                2. Category-Wide Quick Price Adjustment
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Festive discounts, GST changes, or stock replenishment
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Select Target Category
              </label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
              >
                <option value="all">Entire Store Inventory ({products.length} items)</option>
                <option value="laptops">Refurbished Laptops Only</option>
                <option value="desktops">Gaming & Desktops Only</option>
                <option value="components">SSDs & RAM Upgrades Only</option>
                <option value="accessories">Keyboards & Accessories Only</option>
                <option value="monitors">Monitors Only</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Price % Change
                </label>
                <input
                  type="number"
                  placeholder="e.g. -10 for 10% OFF"
                  value={priceAdjustmentPercent || ''}
                  onChange={(e) => setPriceAdjustmentPercent(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Use negative for discount</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Add Stock Units
                </label>
                <input
                  type="number"
                  placeholder="e.g. +10"
                  value={stockAddAmount || ''}
                  onChange={(e) => setStockAddAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Restock quantity</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyCategoryAdjustment}
              className="btn btn-primary"
              style={{ marginTop: '8px', padding: '10px', fontWeight: 700 }}
            >
              <RefreshCw size={15} /> Apply Batch Update Across Category
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
