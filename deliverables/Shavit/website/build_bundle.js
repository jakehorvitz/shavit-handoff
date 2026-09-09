/* Rebuilds app.bundle.js: transpiles each src/*.jsx with Babel (preset-react)
   and concatenates them in dependency order. Run: node build_bundle.js */
const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone');

const ORDER = [
  'Motion.jsx', 'Shared.jsx', 'Intro.jsx', 'Polish.jsx',
  'BlueprintHouse.jsx', 'IsraeliFlagBand.jsx', 'BrrrrIcon.jsx',
  'HomesRevitalized.jsx', 'AccessibilityPage.jsx', 'LegalPage.jsx',
  'Nav.jsx', 'Footer.jsx', 'HomePage.jsx', 'CompaniesPage.jsx',
  'CaseStudiesPage.jsx', 'OpeningsPage.jsx', 'TenantsPage.jsx',
  'MeetPage.jsx', 'ContactPage.jsx', 'App.jsx',
];

let out = '/* Shavit Rootman — pre-compiled bundle (JSX transpiled at build time). */\n';
for (const f of ORDER) {
  const src = fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
  const { code } = Babel.transform(src, { presets: ['react'], filename: f });
  out += `\n/* ===== ${f} ===== */\n${code}\n`;
}
fs.writeFileSync(path.join(__dirname, 'app.bundle.js'), out);
console.log('wrote app.bundle.js', out.length, 'bytes');
