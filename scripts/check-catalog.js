const http = require('http');

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const productsHtml = await fetch('http://localhost:3000/products');
  const adminHtml = await fetch('http://localhost:3000/admin');

  console.log('=== PRODUCTS PAGE ANALYSIS ===');
  const prodCardRegex = /<h3[^>]*class="product-title"[^>]*>([\s\S]*?)<\/h3>/g;
  let match;
  const prodTitles = [];
  while ((match = prodCardRegex.exec(productsHtml)) !== null) {
    prodTitles.push(match[1].trim());
  }
  console.log(`Found ${prodTitles.length} product cards on /products:`);
  prodTitles.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

  console.log('\n=== ADMIN PAGE ANALYSIS ===');
  // Check products in fast daily price table
  // Admin table rows have product titles inside <div style="font-weight: 700; ...">
  const adminProductMatches = [...adminHtml.matchAll(/<div[^>]*class="product-name"[^>]*>([^<]+)<\/div>/g)].map(m => m[1].trim());
  console.log(`Found ${adminProductMatches.length} products listed in /admin:`);
  adminProductMatches.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

  console.log('\n=== CHECK RESULTS ===');
  const matchesExactCount = prodTitles.length === 4;
  console.log('Exact 4 products in customer catalog?', matchesExactCount ? 'YES ✅' : `NO (${prodTitles.length}) ❌`);
  
  const hasParadoxInCatalog = prodTitles.some(t => t.toLowerCase().includes('paradox'));
  console.log('Is PARADOX Keyboard absent from catalog cards?', !hasParadoxInCatalog ? 'YES (Absent) ✅' : 'NO (Still Present!) ❌');
}

run().catch(console.error);
