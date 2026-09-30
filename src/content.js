// Contact details and project list live here.
export const site = {
  name: 'Vincent Vinuya',
  role: 'Full stack developer',
  place: 'Pampanga, PH',
  timeZone: 'Asia/Manila',
  email: 'vincentvinuya33@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/Ultred' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vincentvinuya33' },
  ],
};

export const work = [
  {
    no: 'I',
    title: 'Extractune',
    line: 'Pull the audio, lyrics and song out of any video, on your device.',
    kind: 'Audio tool',
    status: 'Live',
    href: 'https://www.extractune.com/',
    image: '/work/extractune.webp',
    shots: [
      { video: '/work/extractune-tour.webm', src: '/work/extractune.webp' },
      { src: '/work/extractune-studio.webp' },
      { src: '/work/extractune-2.webp' },
    ],
  },
  {
    no: 'II',
    title: 'Lewis Crawl',
    line: 'A pixel dungeon the crowd fights with words.',
    kind: 'Game',
    status: 'Demo · Mobile app soon',
    href: 'https://lewis-crawl.onrender.com/?demo',
    image: '/work/lewis-crawl.webp',
    shots: [
      { video: '/work/lewis-crawl-fight.webm', src: '/work/lewis-crawl-fight.webp', fit: 'contain' },
      { video: '/work/lewis-crawl-boss.webm', src: '/work/lewis-crawl-boss.webp', fit: 'contain' },
      { src: '/work/lewis-crawl.webp' },
    ],
  },
  {
    no: 'III',
    title: 'Link',
    line: 'Hiring for restaurants and hotels, in one place.',
    kind: 'Platform',
    status: 'Live',
    href: 'https://link-hospitality.com/',
    image: '/work/link.webp',
    shots: [{ src: '/work/link.webp' }],
  },
];

export const tapes = [{ title: 'Hideaway', src: '/music/Hideaway.m4a' }];

// The first edition (v1). Earlier, smaller builds, kept as a ledger.
export const archive = {
  href: 'https://vincentvportfolio.vercel.app/',
  items: [
    {
      no: 'I',
      title: 'Order UK',
      line: 'Restaurants and their orders, run from one dashboard.',
      kind: 'Full stack',
      stack: ['React', 'TypeScript', 'Express', 'MongoDB'],
      href: 'https://orderuk-mern.onrender.com/',
      image: '/past/order-uk.webp',
    },
    {
      no: 'II',
      title: 'Coral',
      line: 'A shop with search, categories and Stripe checkout.',
      kind: 'E-commerce',
      stack: ['React', 'TypeScript', 'Zustand', 'Stripe'],
      href: 'https://coral-eccomerce-client.vercel.app/',
      code: 'https://github.com/Ultred/Ultred-Coral-Eccomerce',
      image: '/past/coral.webp',
    },
    {
      no: 'III',
      title: 'TENTS',
      line: 'Event scoring and live tabulation. A team capstone.',
      kind: 'Capstone',
      stack: ['PHP', 'MySQL', 'jQuery'],
      // the live site is gone, so it stays on record without a link
      image: '/past/tents.webp',
    },
    {
      no: 'IV',
      title: 'Taste Quest',
      line: 'Recipes to explore, and favourites to keep.',
      kind: 'Web app',
      stack: ['React', 'Tailwind', 'Spoonacular API'],
      href: 'https://taste-quest-olive.vercel.app/',
      code: 'https://github.com/Ultred/Taste_Quest',
      image: '/past/taste-quest.webp',
    },
    {
      no: 'V',
      title: 'Lefty',
      line: 'A study clone, to get the fundamentals right.',
      kind: 'Study',
      stack: ['HTML', 'Tailwind', 'JavaScript'],
      href: 'https://ultred.github.io/Lefty_Clone/',
      code: 'https://github.com/Ultred/Lefty_Clone',
      image: '/past/lefty.webp',
    },
  ],
};
