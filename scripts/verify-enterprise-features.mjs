import http from 'http';

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
  });
}

async function runVerification() {
  console.log('========================================================');
  console.log('🚀 ENTERPRISE FEATURES VALIDATION: SMARTECH COMPUTERS');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, condition, extra = '') {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name} ${extra}`);
      failed++;
    }
  }

  // 1. Verify Home Page contains Customer Sign In & Header Navigation
  const home = await fetchUrl('/');
  test('Home Page loads HTTP 200', home.status === 200);
  test('Header includes Customer Sign In option', home.body.includes('Customer Sign In') || home.body.includes('Sign In'));
  test('Header includes Shop Owner Portal indicator', home.body.includes('Shop Owner Portal'));
  test('No demo passwords or sample PIN hints visible on homepage', !home.body.includes('PIN: 515201') && !home.body.includes('demo credentials'));

  // 2. Verify Admin Gate uses real email authentication and forgot password
  const admin = await fetchUrl('/admin');
  test('Admin Endpoint loads HTTP 200', admin.status === 200);
  test('Admin Gate renders Enterprise Authentication Modal', admin.body.includes('Enterprise') || admin.body.includes('Shop Owner Portal') || admin.body.includes('Sign In'));
  test('Admin Gate includes Email input field', admin.body.toLowerCase().includes('email'));
  test('Admin Gate includes Password input field', admin.body.toLowerCase().includes('password'));
  test('Admin Gate includes Forgot Password flow trigger', admin.body.toLowerCase().includes('forgot password'));
  test('Zero sample usernames or bypass buttons shown on Admin Gate', !admin.body.includes('Quick Staff Demo') && !admin.body.includes('1-Click Owner Bypass'));

  // 3. Verify Products Page
  const products = await fetchUrl('/products');
  test('Catalog loads HTTP 200', products.status === 200);
  test('Catalog has valid products', products.body.includes('Consistent') || products.body.includes('₹'));

  // 4. Verify Services and Track Pages
  const services = await fetchUrl('/services');
  test('Services Page loads HTTP 200', services.status === 200);
  test('Hindupur in-shop workbench repair option present', services.body.includes('Hindupur') && (services.body.includes('Workbench') || services.body.includes('Walk-In') || services.body.includes('RPGT Road')));

  const track = await fetchUrl('/track');
  test('Order/Repair tracking loads HTTP 200', track.status === 200);

  console.log('\n========================================================');
  console.log(`📊 FINAL RESULT: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================');

  if (failed > 0) process.exit(1);
}

runVerification().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
