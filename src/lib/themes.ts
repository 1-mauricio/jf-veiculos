export interface ColorTheme {
  label: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  accentOnDark: string;
}

export const COLOR_THEMES: Record<string, ColorTheme> = {
  ambar: {
    label: 'Âmbar',
    accent: '#C8862B',
    accentStrong: '#96631E',
    accentSoft: '#F6E7D2',
    accentOnDark: '#DA9F4A',
  },
  azul: {
    label: 'Azul',
    accent: '#2563EB',
    accentStrong: '#1E40AF',
    accentSoft: '#DBEAFE',
    accentOnDark: '#60A5FA',
  },
  verde: {
    label: 'Verde',
    accent: '#16A34A',
    accentStrong: '#166534',
    accentSoft: '#DCFCE7',
    accentOnDark: '#4ADE80',
  },
  vermelho: {
    label: 'Vermelho',
    accent: '#DC2626',
    accentStrong: '#991B1B',
    accentSoft: '#FEE2E2',
    accentOnDark: '#F87171',
  },
  roxo: {
    label: 'Roxo',
    accent: '#7C3AED',
    accentStrong: '#5B21B6',
    accentSoft: '#EDE9FE',
    accentOnDark: '#A78BFA',
  },
};

export interface FontTheme {
  label: string;
  display: string;
  body: string;
  googleFontsUrl: string;
}

export const FONT_THEMES: Record<string, FontTheme> = {
  moderno: {
    label: 'Moderno (Space Grotesk + Inter)',
    display: "'Space Grotesk', ui-sans-serif, sans-serif",
    body: "'Inter', ui-sans-serif, sans-serif",
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  },
  amigavel: {
    label: 'Amigável (Poppins + Inter)',
    display: "'Poppins', ui-sans-serif, sans-serif",
    body: "'Inter', ui-sans-serif, sans-serif",
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  },
  classico: {
    label: 'Clássico (Playfair Display + Source Sans 3)',
    display: "'Playfair Display', ui-serif, serif",
    body: "'Source Sans 3', ui-sans-serif, sans-serif",
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap',
  },
};

export const DEFAULT_COLOR_THEME = 'ambar';
export const DEFAULT_FONT_THEME = 'moderno';
