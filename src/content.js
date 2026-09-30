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

// Earlier builds: the first edition (v1) and side projects, kept as a slim strip.
export const archive = {
  href: 'https://vincentvportfolio.vercel.app/',
  items: [
    {
      no: 'I',
      title: 'Order UK',
      kind: 'Full stack',
      href: 'https://orderuk-mern.onrender.com/',
      image: '/past/order-uk.webp',
    },
    {
      no: 'II',
      title: 'Coral',
      kind: 'E-commerce',
      href: 'https://coral-eccomerce-client.vercel.app/',
      image: '/past/coral.webp',
    },
    {
      no: 'III',
      title: 'TENTS',
      kind: 'Capstone',
      // the live site is gone, so it stays on record without a link
      note: 'Retired',
      image: '/past/tents.webp',
    },
    {
      no: 'IV',
      title: 'Taste Quest',
      kind: 'Web app',
      href: 'https://taste-quest-olive.vercel.app/',
      image: '/past/taste-quest.webp',
    },
    {
      no: 'V',
      title: 'Lefty',
      kind: 'Study',
      href: 'https://ultred.github.io/Lefty_Clone/',
      image: '/past/lefty.webp',
    },
    {
      no: 'VI',
      title: 'HabitIQ',
      kind: 'Mobile app',
      image: '/past/habitiq.webp',
      // no store link yet, so the item opens its screens instead
      screens: [
        { no: 'I', label: 'Hello', src: '/past/habitiq/hello.webp', alt: 'Onboarding: Habi the panda says hello, your friendly habit companion.' },
        { no: 'II', label: 'Today', src: '/past/habitiq/today.webp', alt: "Today: the day's habits, with Habi keeping count." },
        { no: 'III', label: 'Chat', src: '/past/habitiq/chat.webp', alt: 'Chat: setting up a habit by talking with Habi.' },
        { no: 'IV', label: 'Progress', src: '/past/habitiq/progress.webp', alt: 'Progress: a monthly activity calendar and the best days of the week.' },
        { no: 'V', label: 'Streaks', src: '/past/habitiq/streak.webp', alt: 'Streak stages: Habi grows from level 1 to level 100.' },
        { no: 'VI', label: 'Private', src: '/past/habitiq/private.webp', alt: 'Runs on your phone: no servers, no account, buy once.' },
      ],
    },
    {
      no: 'VII',
      title: 'Tow Factory',
      kind: 'Towing service',
      image: '/past/tow-factory.webp',
      // no public link by request; the item opens a recorded tour instead
      screens: [
        {
          no: 'I',
          label: 'Book a tow, then dispatch it',
          video: '/work/tow-factory-tour.webm',
          src: '/work/tow-factory.webp',
          alt: 'Tour: a customer pins pickup and drop-off, books a tow, and an admin accepts it, assigns a driver and tracks the trip.',
        },
      ],
    },
  ],
};
