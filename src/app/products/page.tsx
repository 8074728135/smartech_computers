'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import { Product, ConditionGrade } from '@/types';
import { 
  Filter, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import Link from 'next/link';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const { products } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<ConditionGrade[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [priceMax, setPriceMax] = useState<number>(100000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // CRITICAL: Synchronize state whenever URL searchParams change (e.g. clicking menu items)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const q = searchParams.get('q') || '';
    setSelectedCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams();
    if (catId !== 'all') {
      params.set('category', catId);
    }
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    const queryStr = params.toString();
    router.push(queryStr ? `/products?${queryStr}` : '/products', { scroll: false });
  };

  // Extract all unique brands
  const allBrands = useMemo(() => {
    const brandsSet = new Set(products.map(p => p.brand));
    return Array.from(brandsSet).sort();
  }, [products]);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Inventory' },
    { id: 'laptops', label: 'Refurbished Laptops' },
    { id: 'desktops', label: 'Gaming & Desktop PCs' },
    { id: 'monitors', label: 'Monitors & Displays' },
    { id: 'components', label: 'NVMe SSDs & RAM' },
    { id: 'accessories', label: 'Accessories & Chargers' },
  ];

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleGradeToggle = (grade: ConditionGrade) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setSelectedGrades([]);
    setInStockOnly(false);
    setSearchQuery('');
    setPriceMax(100000);
    setSortBy('featured');
    router.push('/products', { scroll: false });
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesDesc) return false;
      }
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      // Grade filter
      if (selectedGrades.length > 0 && !selectedGrades.includes(product.conditionGrade)) {
        return false;
      }
      // Stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      // Max price
      if (product.price > priceMax) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured/default
    });
  }, [products, selectedCategory, searchQuery, selectedBrands, selectedGrades, inStockOnly, priceMax, sortBy]);

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) +
    selectedBrands.length +
    selectedGrades.length +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (priceMax < 100000 ? 1 : 0);

  return (
    <div className="listing-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span className="separator"><ChevronRight size={14} /></span>
        <Link href="/products">Products</Link>
        {selectedCategory !== 'all' && (
          <>
            <span className="separator"><ChevronRight size={14} /></span>
            <span className="current" style={{ textTransform: 'capitalize' }}>{selectedCategory}</span>
          </>
        )}
      </div>

      {/* Page Title & Controls */}
      <div className="listing-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>
            {selectedCategory === 'all' ? 'All Refurbished Systems & Accessories' : categories.find(c => c.id === selectedCategory)?.label}
          </h1>
          <p className="listing-count">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products in stock
          </p>
        </div>

        <div className="listing-controls">
          {/* Mobile Filter Button */}
          <button 
            className="btn btn-outline btn-sm"
            style={{ display: 'none' }}
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <Filter size={16} /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Sort Selector */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="sort-select"
            aria-label="Sort products by"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Biggest Discount %</option>
            <option value="rating">Highest Customer Rating</option>
          </select>

          {/* Grid/List View Toggle */}
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''} 
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''} 
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Category Filter Pills Bar (Amazon / Flipkart Style) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 0 16px',
        borderBottom: '1px solid var(--gray-200)',
        marginBottom: '20px',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => {
          const count = cat.id === 'all' 
            ? products.length 
            : products.filter(p => p.category === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 15px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--gray-300)',
                background: isSelected ? 'var(--primary)' : 'var(--white)',
                color: isSelected ? 'white' : 'var(--gray-700)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.25)' : 'none'
              }}
            >
              <span>{cat.label}</span>
              <span style={{
                background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--gray-100)',
                color: isSelected ? 'white' : 'var(--gray-600)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '10px'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="listing-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar">
          {/* Active Filters Reset */}
          {activeFiltersCount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'var(--primary-light)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                {activeFiltersCount} Filters Active
              </span>
              <button 
                onClick={handleResetFilters}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={13} /> Reset All
              </button>
            </div>
          )}

          {/* Category Filter */}
          <div className="filter-section">
            <div className="filter-title">Category</div>
            <div className="filter-options">
              {categories.map((cat) => (
                <label 
                  key={cat.id} 
                  className="filter-option"
                  style={{
                    fontWeight: selectedCategory === cat.id ? 700 : 400,
                    color: selectedCategory === cat.id ? 'var(--primary)' : 'inherit',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === cat.id}
                    onChange={() => handleCategoryChange(cat.id)}
                    style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Refurbished Condition Grade */}
          <div className="filter-section">
            <div className="filter-title">
              <span>Refurbished Grade</span>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            </div>
            <div className="filter-options">
              {(['Grade A+', 'Grade A', 'Grade B'] as ConditionGrade[]).map((grade) => (
                <label key={grade} className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={selectedGrades.includes(grade)}
                    onChange={() => handleGradeToggle(grade)}
                  />
                  <span>{grade}</span>
                  <span className="count">
                    ({products.filter(p => p.conditionGrade === grade).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Maximum Price Range Slider */}
          <div className="filter-section">
            <div className="filter-title">
              <span>Max Budget</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--primary)' }}>
                ₹{priceMax.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="price-range">
              <input 
                type="range" 
                min={1000} 
                max={100000} 
                step={2000}
                value={priceMax} 
                onChange={(e) => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                <span>₹1,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-section">
            <div className="filter-title">Brand</div>
            <div className="filter-options" style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {allBrands.map((brand) => (
                <label key={brand} className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span>{brand}</span>
                  <span className="count">
                    ({products.filter(p => p.brand === brand).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="filter-section">
            <div className="filter-title">Availability</div>
            <div className="filter-options">
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>Exclude Out of Stock</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Results Container */}
        <div>
          {/* Quick Search inside results */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Refine inside current view (e.g. 16GB, ThinkPad, Core i7, Touch, SSD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '40px' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--gray-400)' }} />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No matching products found</h3>
              <p>Try adjusting your category, price range, or clearing active filters to see available showroom stock.</p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '24px',
                    padding: '20px',
                    alignItems: 'center'
                  }}
                >
                  <Link href={`/products/${product.id}`} style={{ width: '160px', height: '160px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={product.image} alt={product.title} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span className={`badge ${product.conditionGrade === 'Grade A+' ? 'badge-success' : 'badge-primary'}`}>
                        {product.conditionGrade}
                      </span>
                      <span className="badge badge-accent">{product.brand}</span>
                    </div>
                    <Link href={`/products/${product.id}`}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '8px' }}>
                        {product.title}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '12px', lineHeight: 1.5 }}>
                      {product.description.slice(0, 160)}...
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {product.shortSpecs.map((s, i) => (
                        <span key={i} style={{ background: 'var(--gray-100)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: '200px', textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      {product.mrp > product.price && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </div>
                      )}
                      <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>
                        Save {product.discountPercent}%
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <Link href={`/products/${product.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>Loading products catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
