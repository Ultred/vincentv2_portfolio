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
    shots: [{ src: '/work/extractune.webp' }, { src: '/work/extractune-2.webp' }, { src: '/work/extractune-studio.webp' }],
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
