import { Product, RepairServiceInfo, ServiceBooking, Order, ShopSettings } from '@/types';

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  storeName: 'SMARTECH COMPUTERS',
  ownerName: 'Azeez',
  primaryPhone: '9030400551',
  secondaryPhone: '9949476832',
  whatsappNumber: '9030400551',
  streetDetails: 'RPGT Road, Hindupur',
  locationDetails: 'Hindupur, Near Shilpa Hospital',
  city: 'Hindupur',
  state: 'Andhra Pradesh',
  pincode: '515201',
  timings: 'Monday to Sunday: 9:30 AM – 9:30 PM',
  upiId: '9030400551@ybl',
  announcement: 'Special Offer: Consistent PARADOX Gaming Keyboards & Certified Refurbished Laptops! In-Shop Workbench Repair at RPGT Road, Hindupur.',
  serviceAreas: [
    'Hindupur Town (All Wards)',
    'RPGT Road & Shilpa Hospital Area',
    'Lepakshi',
    'Chilamathur',
    'Penukonda',
    'Somandepalli',
    'Gorantla',
    'Madakasira Bypass'
  ]
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-consistent-ssd',
    title: 'Consistent 512GB NVMe M.2 PCIe Gen3 High-Speed SSD (Brand New)',
    slug: 'consistent-512gb-nvme-ssd',
    brand: 'Consistent',
    category: 'components',
    conditionGrade: 'Grade A+',
    price: 2499,
    mrp: 4500,
    discountPercent: 44,
    stock: 35,
    rating: 4.8,
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80'
    ],
    warranty: '3 Years Consistent Manufacturer Warranty + Free Installation at Shop',
    shortSpecs: ['Up to 2400 MB/s Read Speed', 'PCIe Gen3x4 M.2 2280', '3D NAND Flash', 'Free OS Installation in Shop', 'Compatible with All Laptops & PCs'],
    specs: {
      'Capacity': '512GB',
      'Interface': 'PCIe Gen 3.0 x4, NVMe 1.3',
      'Read Speed': 'Up to 2,400 MB/s',
      'Write Speed': 'Up to 1,800 MB/s',
      'Form Factor': 'M.2 2280'
    },
    description: 'Supercharge any slow laptop or desktop in 15 minutes! Free data cloning and Windows 11 installation available at Smartech Computers RPGT Road workbench.',
    conditionSummary: 'Brand new sealed packaging with 3-year warranty.',
    isDailyDeal: true,
    isFeatured: true,
    isNegotiable: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-hp-prodesk',
    title: 'HP ProDesk 600 G4 Mini PC Core i5 8th Gen (Refurbished)',
    slug: 'hp-prodesk-600-g4-mini-refurbished',
    brand: 'HP',
    category: 'desktops',
    conditionGrade: 'Grade A',
    price: 15499,
    mrp: 45000,
    discountPercent: 66,
    stock: 8,
    rating: 4.6,
    reviewsCount: 65,
    image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80'
    ],
    warranty: '1 Year Smartech Shop Warranty',
    shortSpecs: ['Intel Core i5 6-Core', '16GB DDR4 RAM', '256GB SSD + 500GB HDD', 'Dual Display Support', 'Ultra Compact Tiny Form Factor'],
    specs: {
      'Processor': 'Intel Core i5-8500T 6 Cores 6 Threads',
      'RAM': '16GB DDR4',
      'Storage': '256GB NVMe SSD + 500GB HDD',
      'Size': 'Book size mini desktop PC',
      'Connectivity': 'Built-in Wi-Fi & Bluetooth, DisplayPort, HDMI, USB 3.1'
    },
    description: 'Space-saving micro PC perfect for accounting, billing, clinics, schools, and offices in Hindupur. Low electricity consumption, silent fan, and fits behind your monitor.',
    conditionSummary: 'Grade A corporate pullout. Thoroughly serviced and tested.',
    isDailyDeal: true,
    isFeatured: true,
    isNegotiable: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-samsung-mon',
    title: 'Samsung 24" Borderless IPS Full HD 75Hz Monitor (Certified Refurbished)',
    slug: 'samsung-24-inch-borderless-ips-monitor',
    brand: 'Samsung',
    category: 'monitors',
    conditionGrade: 'Grade A+',
    price: 6499,
    mrp: 14500,
    discountPercent: 55,
    stock: 18,
    rating: 4.8,
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
    ],
    warranty: '6 Months Smartech Warranty + Free HDMI Cable',
    shortSpecs: ['24-inch 1080p IPS Panel', '75Hz Refresh Rate & AMD FreeSync', '3-Sided Borderless', 'Flicker-Free Eye Saver', 'HDMI & VGA Ports'],
    specs: {
      'Resolution': '1920 x 1080 (Full HD)',
      'Panel': 'IPS 178 Degree Viewing Angle',
      'Refresh Rate': '75Hz',
      'Ports': 'HDMI 1.4, VGA, DC-In'
    },
    description: 'Crisp IPS display with minimal bezels. Tested 100% zero dead pixels. Power adapter and HDMI cable included.',
    conditionSummary: 'Pristine Grade A+ condition with genuine power adapter.',
    isDailyDeal: true,
    isFeatured: true,
    isNegotiable: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-typec-charger',
    title: '65W Universal Type-C Laptop Fast Charger (Dell / HP / Lenovo / Mac)',
    slug: '65w-universal-type-c-laptop-charger',
    brand: 'Consistent',
    category: 'accessories',
    conditionGrade: 'Grade A+',
    price: 1199,
    mrp: 2499,
    discountPercent: 52,
    stock: 25,
    rating: 4.8,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80'
    ],
    warranty: '6 Months Replacement Warranty by Smartech',
    shortSpecs: ['65W Fast PD 3.0 Charging', 'Type-C Reversible Port', 'Surge & Heat Protection', '1.8M Heavy Duty Cable', 'Indian 3-Pin Plug'],
    specs: {
      'Output': '5V/3A, 9V/3A, 15V/3A, 20V/3.25A (65W Max)',
      'Compatibility': 'All Type-C laptops including ThinkPad, Latitude, Envy, MacBook Air'
    },
    description: 'Universal 65W PD fast charger. Ideal for USB-C laptops, tablets, and phones. Tested for Indian power spikes.',
    conditionSummary: 'Brand new in box with warranty certificate.',
    isDailyDeal: true,
    isFeatured: true,
    isNegotiable: true,
    updatedAt: new Date().toISOString()
  }
];

export const AVAILABLE_SHOWROOM_TEMPLATES: Product[] = [
  {
    id: 'prod-paradox',
    title: 'Consistent PARADOX Gaming Wired Keyboard (87 Keys RGB, Type-C)',
    slug: 'consistent-paradox-gaming-wired-keyboard',
    brand: 'Consistent',
    category: 'accessories',
    conditionGrade: 'Grade A+',
    price: 1299,
    mrp: 2499,
    discountPercent: 48,
    stock: 20,
    rating: 4.9,
    reviewsCount: 148,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
    ],
    warranty: '1 Year Brand Warranty by Consistent',
    shortSpecs: ['19 Keys Anti-Ghosting', 'RGB Fixed Backlight', '87 Keys Multimedia', 'Windows Lock Key', 'Detachable Type-C'],
    specs: {
      'Model': 'Consistent PARADOX Gaming Keyboard',
      'Layout': 'Compact 87-Keys TKL',
      'Tagline': 'Shock the game, Break the locks'
    },
    description: 'Consistent PARADOX gaming wired keyboard with RGB fixed light and Type-C.',
    conditionSummary: 'Brand New Factory Sealed Pack.',
    isDailyDeal: false,
    isFeatured: false,
    isNegotiable: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-thinkpad',
    title: 'Lenovo ThinkPad T490 14" FHD (Certified Refurbished)',
    slug: 'lenovo-thinkpad-t490-refurbished',
    brand: 'Lenovo',
    category: 'laptops',
    conditionGrade: 'Grade A+',
    price: 24999,
    mrp: 78990,
    discountPercent: 68,
    stock: 6,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'
    ],
    warranty: '1 Year Smartech Shop Warranty',
    shortSpecs: ['Intel Core i5 8th Gen Quad', '16GB DDR4 RAM', '512GB NVMe SSD', '14.0" IPS Anti-Glare'],
    specs: { 'Processor': 'Intel Core i5-8365U', 'RAM': '16GB DDR4', 'Storage': '512GB NVMe SSD' },
    description: 'Ex-corporate leased Lenovo ThinkPad T490 in pristine condition.',
    conditionSummary: 'Grade A+ condition.',
    isDailyDeal: false,
    isFeatured: false,
    isNegotiable: true,
  }
];

export const REPAIR_SERVICES: RepairServiceInfo[] = [
  {
    id: 'srv-1',
    title: 'Laptop Screen Replacement (LED/IPS)',
    category: 'Screen & Display',
    icon: 'Monitor',
    startingPrice: 1899,
    turnaroundTime: '1 - 2 Hours',
    sameDayRepair: true,
    isNegotiable: true,
    description: 'Cracked, broken, lines on display, or blank screen. 100% original A+ grade replacement screens for Dell, HP, Lenovo, Acer, Asus, Apple, etc. Fitted directly at our RPGT Road shop workbench in Hindupur.',
    commonIssues: ['Black screen with light', 'Cracked glass / color lines', 'Dim display / backlight dead', 'Dead pixels or ink blot patches']
  },
  {
    id: 'srv-2',
    title: 'Laptop Keyboard & Touchpad Replacement',
    category: 'Input Devices',
    icon: 'Keyboard',
    startingPrice: 650,
    turnaroundTime: '45 - 90 Minutes',
    sameDayRepair: true,
    isNegotiable: true,
    description: 'Keys not responding, water/tea spill damage, automatic typing ghost keys. Original replacement keyboards with or without backlight fitted at our workbench.',
    commonIssues: ['Automatic typing / ghost keys', 'Water or liquid spill damage', 'Missing keys / broken rubber dome', 'Backlight not turning on']
  },
  {
    id: 'srv-3',
    title: 'Battery Replacement & Charging Issues',
    category: 'Power & Battery',
    icon: 'BatteryCharging',
    startingPrice: 1200,
    turnaroundTime: '30 - 60 Minutes',
    sameDayRepair: true,
    isNegotiable: true,
    description: 'Laptop not holding charge, battery swelling up, or "Plugged in, not charging" error. OEM and high-capacity batteries tested on-the-spot with 6 to 12 months warranty.',
    commonIssues: ['Laptop dies instantly when unplugged', 'Battery swollen pushing touchpad up', 'Charger socket loose / DC jack broken', 'Overheating while charging']
  },
  {
    id: 'srv-4',
    title: 'Motherboard Chip-Level Repair (BGA)',
    category: 'Core Hardware',
    icon: 'Cpu',
    startingPrice: 1499,
    turnaroundTime: '24 - 48 Hours',
    sameDayRepair: false,
    isNegotiable: true,
    description: 'Dead laptop, short circuits, IC burning, BIOS corruption, or charging section IC failure. Repaired at our RPGT Road workbench using advanced BGA rework stations and oscilloscopes.',
    commonIssues: ['Completely dead with no LED indicator', 'Blue screen of death (BSOD) loops', 'Burning smell or spark from laptop', 'Liquid / juice spill short circuit']
  },
  {
    id: 'srv-5',
    title: 'Full Deep Cleaning & Thermal Repaste',
    category: 'Maintenance',
    icon: 'Fan',
    startingPrice: 499,
    turnaroundTime: '45 Minutes',
    sameDayRepair: true,
    isNegotiable: true,
    description: 'Loud fan noise, extreme heating, laptop shutting down suddenly while working or gaming. We clean out dust heatsinks and apply Arctic MX-4 thermal paste at our shop.',
    commonIssues: ['Laptop becomes very hot underneath', 'Fan making grinding or roaring noise', 'Shuts down automatically after 15 mins', 'Sluggish performance under load']
  },
  {
    id: 'srv-6',
    title: 'SSD & RAM Speed Upgrade (Windows 11 Setup)',
    category: 'Performance',
    icon: 'HardDrive',
    startingPrice: 350,
    turnaroundTime: '45 Minutes',
    sameDayRepair: true,
    isNegotiable: true,
    description: 'Make your 5-year-old slow laptop run like a brand new rocket. Upgrade slow mechanical HDD to lightning NVMe SSD with 100% data preservation and OS cloning at our shop.',
    commonIssues: ['Taking 5-10 minutes just to turn on', '100% Disk Usage error in Windows', 'Freezing when opening Google Chrome', 'Insufficient memory errors']
  },
  {
    id: 'srv-7',
    title: 'Broken Hinge & Body Fabrication',
    category: 'Body & Chassis',
    icon: 'Wrench',
    startingPrice: 799,
    turnaroundTime: '3 - 5 Hours',
    sameDayRepair: false,
    isNegotiable: true,
    description: 'Cracked laptop corners, screen separating from keyboard base, loose hinges making screen fall backwards. Specialized metallic reinforcement and plastic fabrication at our workbench.',
    commonIssues: ['Laptop lid does not open or close smoothly', 'Screen bezel popped out and cracking', 'Screw anchors broken inside casing', 'Base corner split open']
  },
  {
    id: 'srv-8',
    title: 'Desktop PC & Custom Tower Repair (In-Shop)',
    category: 'Desktop & Towers',
    icon: 'Cpu',
    startingPrice: 399,
    turnaroundTime: 'Same Day / 24 Hours',
    sameDayRepair: true,
    isNegotiable: true,
    description: 'Walk-in desktop PC repair at our RPGT Road shop. Power supply (SMPS) testing, graphics card diagnostic, no-display troubleshooting, and custom PC assembly.',
    commonIssues: ['PC powers on but no display output', 'Frequent random restarts or BSOD', 'SMPS failure or burnt smell', 'BIOS update and hardware compatibility']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-sm-101',
    orderNumber: 'SM-81204',
    customerName: 'K. Venkatesh',
    phone: '9848022334',
    email: 'venkatesh.hdp@gmail.com',
    shippingAddress: 'Door No. 4/128, Melapuram, Near RTC Bus Stand',
    city: 'Hindupur',
    pincode: '515201',
    items: [
      {
        productId: 'prod-paradox',
        title: 'Consistent PARADOX Gaming Wired Keyboard (87 Keys RGB, Type-C)',
        price: 1299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        conditionGrade: 'Grade A+'
      }
    ],
    subtotal: 1299,
    discount: 0,
    deliveryCharge: 0,
    total: 1299,
    paymentMethod: 'UPI / Online',
    paymentStatus: 'Paid',
    orderStatus: 'Dispatched',
    createdAt: '2026-09-24T06:30:00.000Z',
    estimatedDelivery: 'Today by 4:00 PM (Local Delivery)'
  },
  {
    id: 'ord-sm-102',
    orderNumber: 'SM-81205',
    customerName: 'Shaik Noorullah',
    phone: '9440112233',
    email: 'noor.shaik@gmail.com',
    shippingAddress: 'Shop self-pickup counter, RPGT Road',
    city: 'Hindupur',
    pincode: '515201',
    items: [
      {
        productId: 'prod-thinkpad',
        title: 'Lenovo ThinkPad T490 14" FHD (Certified Refurbished)',
        price: 24999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
        conditionGrade: 'Grade A+'
      }
    ],
    subtotal: 24999,
    discount: 500,
    deliveryCharge: 0,
    total: 24499,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Pending (COD)',
    orderStatus: 'Confirmed',
    createdAt: '2026-09-24T08:15:00.000Z',
    estimatedDelivery: 'Ready for Store Pickup'
  }
];

export const INITIAL_SERVICES: ServiceBooking[] = [
  {
    id: 'srv-sm-1',
    bookingNumber: 'SRV-5101',
    customerName: 'M. Ramesh Babu',
    phone: '9030400551',
    email: 'ramesh.babu@gmail.com',
    address: 'Near Shilpa Hospital, RPGT Road',
    pincode: '515201',
    city: 'Hindupur',
    deviceType: 'Laptop',
    deviceBrandModel: 'Dell Inspiron 15 3567',
    issueCategory: 'Screen & Display',
    issueDescription: 'Laptop screen cracked after falling from desk. White vertical patches showing.',
    serviceMode: 'shop_dropoff',
    scheduledDate: '2026-09-24',
    timeSlot: 'Store Hours Walk-In',
    status: 'Technician Assigned',
    estimatedCost: 2600,
    technicianName: 'Azeez (Senior Hardware Tech)',
    technicianNotes: '30-pin 15.6" HD Slim LED panel allocated from Smartech inventory.',
    createdAt: '2026-09-24T07:20:00.000Z'
  },
  {
    id: 'srv-sm-2',
    bookingNumber: 'SRV-5102',
    customerName: 'Syed Imran',
    phone: '9949476832',
    email: 'imran.syed@gmail.com',
    address: 'Main Bazaar, Lepakshi Road',
    pincode: '515201',
    city: 'Hindupur',
    deviceType: 'Desktop PC',
    deviceBrandModel: 'Core i5 Tower PC',
    issueCategory: 'Performance',
    issueDescription: 'PC taking 10 minutes to open Tally and Excel. Need Consistent 512GB SSD upgrade and Windows installation.',
    serviceMode: 'shop_dropoff',
    scheduledDate: '2026-09-24',
    timeSlot: '11:00 AM - 1:00 PM',
    status: 'Repair Complete',
    estimatedCost: 2849,
    technicianName: 'Smartech Workbench Team',
    technicianNotes: 'Consistent 512GB SSD installed, Tally data migrated, tested 100% OK.',
    createdAt: '2026-09-24T08:00:00.000Z'
  }
];
