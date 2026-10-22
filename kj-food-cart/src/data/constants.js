export const SOCIALS = [
  {
    platform: 'Facebook',
    name: "Kenneth Jay's Foodcart",
    icon: 'fa-brands fa-facebook-f',
    color: '#5282f6',
    url: 'https://facebook.com/profile.php?id=100083582496229'
  },
  {
    platform: 'Instagram',
    name: 'sorbetesdavao.8000',
    icon: 'fa-brands fa-instagram',
    color: '#ff69a5',
    url: 'https://instagram.com/sorbetesdavao.8000'
  },
  {
    platform: 'TikTok',
    name: 'Sorbetes & Treats Davao',
    icon: 'fa-brands fa-tiktok',
    color: '#332946',
    url: 'https://tiktok.com/@SorbetesAndTreatsDavao'
  },
  {
    platform: 'Messenger',
    name: "Kenneth Jay's Foodcart",
    icon: 'fa-brands fa-facebook-messenger',
    color: '#3bb5ff',
    url: 'https://m.me/100083582496229'
  },
  {
    platform: 'Call Us',
    name: '09619803328',
    icon: 'fa-solid fa-phone',
    color: '#26a679',
    url: 'tel:09619803328'
  },
  {
    platform: 'Gmail',
    name: 'kennethjaymondonedo69@gmail.com',
    icon: 'fa-solid fa-envelope',
    color: '#6388f8',
    url: 'mailto:kennethjaymondonedo69@gmail.com'
  }
];

export const DOWNPAYMENT = 500;
export const CUSTOM_UNIT = 25;
export const COLORS = ['#ff7eb6', '#ffd34d', '#7fe5c4', '#b99cff', '#7cc8ff'];
export const FB_URL = (SOCIALS.find(s => s.platform === 'Messenger') || {}).url;

export const PRODUCTS = {
  cottoncandy: {
    name: 'Cotton Candy', emoji: '🍭', color: '#c9b3ff', area: 'cc', tag: 'Standard blue and pink',
    qtyLabel: 'Quantity Selection', max: 0,
    pk: [{ id: 'cc-100', name: '100 Pieces', price: 2500 }], fl: []
  },
  popcorn: {
    name: 'Popcorn', emoji: '🍿', color: '#ffe27a', area: 'po', qtyLabel: 'Package', max: 3,
    pk: [{ id: 'po-100', name: '100 Paper Boxes', price: 2500 }],
    fl: [{ n: 'Classic Butter', e: '🧈' }, { n: 'Cheese', e: '🧀' }, { n: 'BBQ', e: '🍖' }, { n: 'Sweet Caramel', e: '🍯' }]
  },
  icecream: {
    name: 'Ice Cream', emoji: '🍦', color: '#ff9ccb', area: 'ic', qtyLabel: 'Quantity & Package', max: 3,
    pk: [
      { id: 'ic-50', name: '50 Cones', price: 1250 },
      { id: 'ic-100', name: '100 Cones', price: 2500 },
      { id: 'ic-unli', name: 'UNLI', price: 6000 },
      { id: 'ic-custom', name: 'Custom', price: 0, custom: true }
    ],
    fl: [
      { n: 'Charcoal', best: 1 }, { n: 'Durian', best: 1 }, { n: 'Dragon Fruit', best: 1 },
      { n: 'Mango' }, { n: 'Avocado' }, { n: 'Cookies & Cream' }, { n: 'Ube' }
    ]
  },
  taho: {
    name: 'Taho', emoji: '🥤', color: '#ffd0a8', area: 'ta', tag: 'Classic hot taho',
    qtyLabel: 'Quantity Selection', max: 0,
    pk: [{ id: 'ta-100', name: '100 Pax', price: 2500 }], fl: []
  },
  fries: {
    name: 'Fries', emoji: '🍟', color: '#ff9f8e', area: 'fr', qtyLabel: 'Package', max: 3,
    pk: [{ id: 'fr-100', name: '100 Pax', price: 2500 }],
    fl: [{ n: 'Cheese', e: '🧀' }, { n: 'BBQ', e: '🍖' }, { n: 'Sour Cream', e: '🥛' }]
  }
};

export const peso = n => '₱' + Number(n).toLocaleString();
export const peso2 = n => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtDate = d => {
  const x = new Date(d + 'T00:00');
  return isNaN(x) ? d : x.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
};
export const fmtTime = t => {
  const [h, m] = String(t).split(':').map(Number);
  return isNaN(h) ? t : ((h % 12) || 12) + ':' + String(m).padStart(2, '0') + ' ' + (h < 12 ? 'AM' : 'PM');
};