export interface ProductPick {
  name: string;
  category: string;
  summary: string;
  note?: string;
  href?: string;
}

export interface ProductPlatform {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  angle: string;
  products: ProductPick[];
}

export const productPlatforms: ProductPlatform[] = [
  {
    slug: 'temu',
    name: 'Temu',
    eyebrow: 'Low-ticket finds',
    description:
      'Useful accessories, desk add-ons, and impulse-friendly product ideas you can review or round up later.',
    angle: 'Good for visual lists, quick buys, and lower-cost setup extras.',
    products: [
      {
        name: 'Adjustable phone stand',
        category: 'Desk accessory',
        summary:
          'Simple foldable stand for recording, browsing, or keeping a phone visible at a workstation.',
        note: 'Easy fit for desk setup or creator-tools roundup posts.',
      },
      {
        name: 'Cable clip organizer set',
        category: 'Workspace',
        summary: 'Small adhesive cable holders for cleaner desk routing and less visual clutter.',
        note: 'Works well in productivity or office-refresh content.',
      },
      {
        name: 'Mini LED light bar',
        category: 'Lighting',
        summary:
          'Compact accent light for shelves, desk scenes, or background glow in content setups.',
      },
      {
        name: 'Monitor riser shelf',
        category: 'Workspace',
        summary:
          'Basic riser to lift screens, open more space underneath, and improve layout photos.',
      },
      {
        name: 'Drawer organizer pack',
        category: 'Organization',
        summary: 'Stackable trays for desk tools, cables, stationery, or small camera accessories.',
      },
      {
        name: 'Portable mini tripod',
        category: 'Creator gear',
        summary: 'Entry-level tripod for phone clips, quick product videos, and tabletop shooting.',
      },
    ],
  },
  {
    slug: 'amazon',
    name: 'Amazon',
    eyebrow: 'Everyday gear',
    description:
      'Reliable, familiar products for workstations, creator kits, and office-tech recommendations.',
    angle: 'Best for mainstream gear lists and products people already trust.',
    products: [
      {
        name: 'USB-C docking hub',
        category: 'Tech',
        summary:
          'Multi-port hub for laptops, monitors, drives, and charging in one simple desk setup.',
      },
      {
        name: '1080p webcam',
        category: 'Creator gear',
        summary:
          'Clean video option for meetings, livestreams, or better-looking tutorial content.',
      },
      {
        name: 'Mechanical keyboard',
        category: 'Workspace',
        summary: 'Typing-focused keyboard pick for coding, writing, and everyday office use.',
      },
      {
        name: 'Clip-on microphone',
        category: 'Audio',
        summary: 'Small lav-style mic for talking-head videos, tutorials, interviews, or reviews.',
      },
      {
        name: 'Portable SSD',
        category: 'Storage',
        summary:
          'Fast external storage for media backups, content transfers, and project archives.',
      },
      {
        name: 'Ring light kit',
        category: 'Lighting',
        summary:
          'Classic starter lighting option for better product shots and face lighting indoors.',
      },
    ],
  },
  {
    slug: 'tiktok-shop',
    name: 'TikTok Shop',
    eyebrow: 'Trend-led picks',
    description:
      'Fast-moving creator-focused products and visually strong items that fit short-form content.',
    angle: 'Good for social-first product discovery and trend-reactive content.',
    products: [
      {
        name: 'MagSafe grip mount',
        category: 'Phone gear',
        summary: 'Quick phone mount option for filming, scrolling, or hands-free product demos.',
      },
      {
        name: 'Rechargeable desk fan',
        category: 'Desk comfort',
        summary: 'Compact fan for office desks, streaming setups, or small room comfort content.',
      },
      {
        name: 'Wireless clip mic set',
        category: 'Audio',
        summary: 'Portable mic system for short-form videos, street clips, or quick testimonials.',
      },
      {
        name: 'LED mirror light strip',
        category: 'Beauty / lighting',
        summary:
          'Visual upgrade for vanity, studio, or product display content where lighting matters.',
      },
      {
        name: 'Non-slip desk mat',
        category: 'Workspace',
        summary:
          'Large desk mat that improves visuals for keyboard, mouse, and top-down product shots.',
      },
      {
        name: 'Tabletop overhead stand',
        category: 'Creator gear',
        summary: 'Useful for unboxings, tutorials, and overhead filming without a full studio rig.',
      },
    ],
  },
  {
    slug: 'alibaba',
    name: 'Alibaba',
    eyebrow: 'Bulk + sourcing',
    description:
      'Supplier-style listings, packaging ideas, and bulk order products for resell or brand packaging research.',
    angle: 'Useful for sourcing pages, supplier roundups, or custom packaging research.',
    products: [
      {
        name: 'Custom shipping boxes',
        category: 'Packaging',
        summary:
          'Branded box sourcing idea for ecommerce shipments, kits, or product packaging upgrades.',
      },
      {
        name: 'Acrylic display stands',
        category: 'Display',
        summary: 'Clean product display option for pop-ups, desk shelves, or showroom content.',
      },
      {
        name: 'Bulk phone grip pack',
        category: 'Accessories',
        summary:
          'Low-cost accessory idea for branded giveaways, resale bundles, or campaign packs.',
      },
      {
        name: 'Sample neon sign',
        category: 'Branding',
        summary:
          'Decor or branded backdrop item for content sets, studios, booths, or retail corners.',
      },
      {
        name: 'Custom tote bags',
        category: 'Merch',
        summary: 'Simple merchandise or packaging add-on for events, stores, or branded campaigns.',
      },
      {
        name: 'Product insert cards',
        category: 'Print / packaging',
        summary: 'Insert cards for care instructions, QR links, brand story, or promo messaging.',
      },
    ],
  },
];
