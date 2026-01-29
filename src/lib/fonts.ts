// 50+ Google Fonts organized by category
// All fonts are free and optimized for web use

// Shared font family mapping for all blocks - CSS font-family values
export const FONT_FAMILY_MAP: Record<string, string> = {
  // Google Fonts - Sans-serif Modern
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  raleway: "'Raleway', sans-serif",
  opensans: "'Open Sans', sans-serif",
  roboto: "'Roboto', sans-serif",
  nunito: "'Nunito', sans-serif",
  ubuntu: "'Ubuntu', sans-serif",
  outfit: "'Outfit', sans-serif",
  workSans: "'Work Sans', sans-serif",
  dmSans: "'DM Sans', sans-serif",
  spacegrotesk: "'Space Grotesk', sans-serif",
  manrope: "'Manrope', sans-serif",
  plusjakarta: "'Plus Jakarta Sans', sans-serif",
  bevietnampro: "'Be Vietnam Pro', sans-serif",
  sora: "'Sora', sans-serif",
  
  // Google Fonts - Serif Elegant
  playfair: "'Playfair Display', serif",
  lora: "'Lora', serif",
  merriweather: "'Merriweather', serif",
  
  // Google Fonts - Monospace Technical
  sourcecodepro: "'Source Code Pro', monospace",
  
  // System Fonts - Sans-serif
  arial: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  calibri: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
  verdana: "Verdana, Geneva, sans-serif",
  tahoma: "Tahoma, Geneva, Verdana, sans-serif",
  trebuchet: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', sans-serif",
  
  // System Fonts - Serif
  timesnewroman: "'Times New Roman', Times, serif",
  georgia: "Georgia, Times, 'Times New Roman', serif",
  garamond: "Garamond, Baskerville, 'Baskerville Old Face', 'Hoefler Text', 'Times New Roman', serif",
  
  // System Fonts - Monospace & Fun
  couriernew: "'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace",
  comicsans: "'Comic Sans MS', 'Comic Sans', cursive",
};

export const GOOGLE_FONTS = {
  // === SANS-SERIF (Modern, Clean) ===
  'sans-serif': [
    { name: 'Inter', value: 'Inter, sans-serif', popular: true },
    { name: 'Roboto', value: 'Roboto, sans-serif', popular: true },
    { name: 'Poppins', value: 'Poppins, sans-serif', popular: true },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', popular: true },
    { name: 'Open Sans', value: '"Open Sans", sans-serif', popular: true },
    { name: 'Lato', value: 'Lato, sans-serif', popular: true },
    { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
    { name: 'Raleway', value: 'Raleway, sans-serif' },
    { name: 'Work Sans', value: '"Work Sans", sans-serif' },
    { name: 'Nunito', value: 'Nunito, sans-serif' },
    { name: 'DM Sans', value: '"DM Sans", sans-serif' },
    { name: 'Outfit', value: 'Outfit, sans-serif' },
    { name: 'Manrope', value: 'Manrope, sans-serif' },
    { name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
  ],
  
  // === SERIF (Elegant, Traditional) ===
  'serif': [
    { name: 'Playfair Display', value: '"Playfair Display", serif', popular: true },
    { name: 'Merriweather', value: 'Merriweather, serif', popular: true },
    { name: 'Lora', value: 'Lora, serif', popular: true },
    { name: 'Crimson Text', value: '"Crimson Text", serif' },
    { name: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
    { name: 'EB Garamond', value: '"EB Garamond", serif' },
    { name: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
    { name: 'PT Serif', value: '"PT Serif", serif' },
    { name: 'Spectral', value: 'Spectral, serif' },
  ],
  
  // === DISPLAY (Bold, Attention-Grabbing) ===
  'display': [
    { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif', popular: true },
    { name: 'Anton', value: 'Anton, sans-serif' },
    { name: 'Oswald', value: 'Oswald, sans-serif' },
    { name: 'Archivo Black', value: '"Archivo Black", sans-serif' },
    { name: 'Passion One', value: '"Passion One", sans-serif' },
    { name: 'Righteous', value: 'Righteous, sans-serif' },
    { name: 'Titan One', value: '"Titan One", sans-serif' },
    { name: 'Fredoka One', value: '"Fredoka One", sans-serif' },
  ],
  
  // === HANDWRITING/SCRIPT (Personal, Creative) ===
  'handwriting': [
    { name: 'Dancing Script', value: '"Dancing Script", cursive', popular: true },
    { name: 'Pacifico', value: 'Pacifico, cursive', popular: true },
    { name: 'Caveat', value: 'Caveat, cursive' },
    { name: 'Shadows Into Light', value: '"Shadows Into Light", cursive' },
    { name: 'Satisfy', value: 'Satisfy, cursive' },
    { name: 'Cookie', value: 'Cookie, cursive' },
    { name: 'Great Vibes', value: '"Great Vibes", cursive' },
  ],
  
  // === MONOSPACE (Technical, Code) ===
  'monospace': [
    { name: 'Roboto Mono', value: '"Roboto Mono", monospace', popular: true },
    { name: 'Fira Code', value: '"Fira Code", monospace' },
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { name: 'Source Code Pro', value: '"Source Code Pro", monospace' },
    { name: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' },
  ],
} as const;

// Flat list of all fonts for dropdown
export const ALL_FONTS = [
  ...GOOGLE_FONTS['sans-serif'],
  ...GOOGLE_FONTS.serif,
  ...GOOGLE_FONTS.display,
  ...GOOGLE_FONTS.handwriting,
  ...GOOGLE_FONTS.monospace,
];

// Popular fonts only (for quick access)
export const POPULAR_FONTS = ALL_FONTS.filter(font => 'popular' in font && font.popular);
