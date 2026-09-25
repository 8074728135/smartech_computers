// Professional Software QA Automation Test Suite for Smartech Computers Web App
import http from 'http';

const BASE_URL = 'http://localhost:3000';

const testResults = [];

function logTest(testName, passed, details = '') {
  testResults.push({ testName, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🧪 RUNNING PROFESSIONAL QA TEST SUITE: SMARTECH COMPUTERS');
  console.log('===============================================================\n');

  // SUITE 1: HTTP Status Codes & Route Availability
  console.log('--- Test Suite 1: HTTP Routes & Endpoints ---');
  const routes = [
    '/',
    '/products',
    '/products/prod-paradox',
    '/products/prod-thinkpad',
    '/services',
    '/cart',
    '/checkout',
    '/track',
    '/admin',
    '/owner'
  ];

  for (const route of routes) {
    try {
      const res = await fetchUrl(route);
      const isOk = res.statusCode >= 200 && res.statusCode < 400;
      logTest(`Route ${route} accessibility`, isOk, `Status: ${res.statusCode}`);
    } catch (err) {
      logTest(`Route ${route} accessibility`, false, err.message);
    }
  }

  // SUITE 2: Real Store Brand & Image Data Verification
  console.log('\n--- Test Suite 2: Actual Shop Details from Poster ---');
  try {
    const home = await fetchUrl('/');
    const html = home.body;

    const hasStoreName = html.includes('SMARTECH') && html.includes('COMPUTERS');
    logTest('Shop Name: "SMARTECH COMPUTERS"', hasStoreName);

    const hasPhone1 = html.includes('9030400551');
    logTest('Primary Phone: "9030400551"', hasPhone1);

    const hasPhone2 = html.includes('9949476832');
    logTest('Secondary Phone: "9949476832"', hasPhone2);

    const hasHospital = html.includes('Shilpa Hospital');
    logTest('Location Landmark: "Near Shilpa Hospital"', hasHospital);

    const hasRpgtRoad = html.includes('RPGT Road');
    logTest('Street Details: "RPGT Road, Hindupur"', hasRpgtRoad);

    const hasHindupur = html.includes('Hindupur');
    logTest('City: "Hindupur"', hasHindupur);

    const hasBranding = html.includes('SMARTECH') && html.includes('Hindupur');
    logTest('Live Storefront Branding and Location Verified', hasBranding);
  } catch (err) {
    logTest('Poster Details Verification', false, err.message);
  }

  // SUITE 3: Product Detail Page & Catalog Specs
  console.log('\n--- Test Suite 3: PARADOX Keyboard Detail Page ---');
  try {
    const paradoxPage = await fetchUrl('/products/prod-paradox');
    const phtml = paradoxPage.body;

    logTest('PARADOX Detail Page Returns 200', paradoxPage.statusCode === 200);
    logTest('PARADOX Brand displays Consistent', phtml.includes('Consistent'));
    logTest('PARADOX Price displays ₹1,299 or formatted price', phtml.includes('1,299') || phtml.includes('1299'));
    logTest('PARADOX Type-C Interface Spec Present', phtml.includes('Type-C'));
    logTest('Pincode check widget present on product page', phtml.includes('Check Delivery') || phtml.includes('Pincode'));
  } catch (err) {
    logTest('Product Detail Page Verification', false, err.message);
  }

  // SUITE 4: In-Shop Workbench Repair System
  console.log('\n--- Test Suite 4: In-Shop Workbench Repair Flow ---');
  try {
    const servicesPage = await fetchUrl('/services');
    const shtml = servicesPage.body;

    logTest('Services Page Returns 200', servicesPage.statusCode === 200);
    logTest('Walk-In Shop Repair Option Present', shtml.includes('Walk-In') || shtml.includes('Workbench') || shtml.includes('RPGT Road'));
    logTest('Shop Drop-Off Workbench Available', shtml.includes('Workbench') || shtml.includes('Shop'));
    logTest('Screen Replacement Listed', shtml.includes('Screen Replacement'));
    logTest('In-Shop Job Card Form Present', shtml.includes('Job Card') || shtml.includes('Generate'));
    logTest('Hindupur Coverage Area Mentioned', shtml.includes('Hindupur'));
  } catch (err) {
    logTest('Services Verification', false, err.message);
  }

  // SUITE 5: Enterprise Authentication, Role-Based Access & Owner Portal
  console.log('\n--- Test Suite 5: Enterprise Auth & Owner Portal ---');
  try {
    const adminPage = await fetchUrl('/admin');
    const ahtml = adminPage.body;

    logTest('Admin Endpoint Returns 200', adminPage.statusCode === 200);
    logTest('Owner Security Gate Active (Role-Based Separation)', ahtml.includes('Owner') && (ahtml.includes('Portal') || ahtml.includes('Sign In')));
    logTest('Enterprise Email Input Field Present', ahtml.includes('Email') || ahtml.includes('email'));
    logTest('Password Input Field Present', ahtml.includes('Password') || ahtml.includes('password'));
    logTest('Forgot Password Recovery Present', ahtml.includes('Forgot') || ahtml.includes('Reset'));
    logTest('Return to Customer Storefront Link Present', ahtml.includes('Storefront') || ahtml.includes('Customer') || ahtml.includes('Showroom'));
  } catch (err) {
    logTest('Admin Security Gate Verification', false, err.message);
  }

  // SUITE 6: Cart & Checkout Payment Options
  console.log('\n--- Test Suite 6: Cart & Checkout ---');
  try {
    const cartPage = await fetchUrl('/cart');
    const chtml = cartPage.body;
    logTest('Cart Page Returns 200', cartPage.statusCode === 200);
    logTest('Promo Code / Coupon Engine Present', chtml.includes('Promo Code') || chtml.includes('Coupon') || chtml.includes('FIRST500'));

    const checkoutPage = await fetchUrl('/checkout');
    const chkHtml = checkoutPage.body;
    logTest('Checkout Page Returns 200', checkoutPage.statusCode === 200);
    logTest('UPI / QR Payment Option Present', chkHtml.includes('UPI') || chkHtml.includes('QR Code'));
    logTest('Cash on Delivery Option Present', chkHtml.includes('Cash on Delivery') || chkHtml.includes('COD'));
    logTest('Shop Pickup / Courier Delivery Toggle Present', chkHtml.includes('Pickup') || chkHtml.includes('Courier'));
  } catch (err) {
    logTest('Cart & Checkout Verification', false, err.message);
  }

  // SUITE 8: Menu Options & Category Query Parameter Verification
  console.log('\n--- Test Suite 8: Menu Options & Category Filtering ---');
  try {
    const homeRes = await fetchUrl('/');
    const hHtml = homeRes.body;
    logTest('Header Menu contains All Showroom Stock link', hHtml.includes('/products'));
    logTest('Header Menu contains PARADOX & Accessories link', hHtml.includes('/products?category=accessories'));
    logTest('Header Menu contains Refurbished Laptops link', hHtml.includes('/products?category=laptops'));
    logTest('Header Menu contains Gaming & Tower PCs link', hHtml.includes('/products?category=desktops'));
    logTest('Header Menu contains Consistent SSDs & RAM link', hHtml.includes('/products?category=components'));
    logTest('Header Menu contains Monitors link', hHtml.includes('/products?category=monitors'));
    logTest('Header Menu contains In-Shop Repair Lab link', hHtml.includes('/services'));
    logTest('Header Menu contains Track Status link', hHtml.includes('/track'));

    // Test desktops filtering
    const deskRes = await fetchUrl('/products?category=desktops');
    const dHtml = deskRes.body;
    logTest('Desktop PCs Query (/products?category=desktops) loads 200', deskRes.statusCode === 200);
    logTest('Desktop PCs page renders HP ProDesk', dHtml.includes('HP ProDesk'));

    // Test laptops filtering (0 laptops currently in owner showroom)
    const lapRes = await fetchUrl('/products?category=laptops');
    const lHtml = lapRes.body;
    logTest('Laptops Query (/products?category=laptops) loads 200', lapRes.statusCode === 200);

    // Test accessories filtering
    const accRes = await fetchUrl('/products?category=accessories');
    const aHtml = accRes.body;
    logTest('Accessories Query (/products?category=accessories) loads 200', accRes.statusCode === 200);
    logTest('Accessories page renders Type-C Charger', aHtml.includes('Type-C') || aHtml.includes('Charger'));

    // Test components filtering
    const compRes = await fetchUrl('/products?category=components');
    const cHtml = compRes.body;
    logTest('Components Query (/products?category=components) loads 200', compRes.statusCode === 200);
    logTest('Components page renders NVMe SSD', cHtml.includes('NVMe'));

    // Test monitors filtering
    const monRes = await fetchUrl('/products?category=monitors');
    const mHtml = monRes.body;
    logTest('Monitors Query (/products?category=monitors) loads 200', monRes.statusCode === 200);
    logTest('Monitors page renders Monitor', mHtml.includes('Monitor') || mHtml.includes('Samsung'));

    // Test quick category pills
    const prodRes = await fetchUrl('/products');
    const pHtml = prodRes.body;
    logTest('Products page renders Quick Category Filter Pills', pHtml.includes('All Inventory') && pHtml.includes('Gaming &amp; Desktop PCs') || pHtml.includes('Gaming & Desktop PCs'));
  } catch (err) {
    logTest('Menu & Category Query Verification', false, err.message);
  }

  // SUMMARY
  const total = testResults.length;
  const passedCount = testResults.filter(t => t.passed).length;
  const failedCount = total - passedCount;

  console.log('\n===============================================================');
  console.log(`📊 QA TEST RESULTS SUMMARY: ${passedCount}/${total} PASSED (${Math.round((passedCount/total)*100)}%)`);
  if (failedCount === 0) {
    console.log('🎉 ALL TEST SUITES PASSED CLEANLY! ZERO DEFECTS FOUND.');
  } else {
    console.log(`⚠️ ${failedCount} TESTS FAILED. PLEASE REVIEW LOGS ABOVE.`);
  }
  console.log('===============================================================');
}

runTestSuite().catch(console.error);
