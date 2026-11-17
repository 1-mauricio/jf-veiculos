export interface ColorTheme {
  label: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  accentOnDark: string;
  /** Cor do texto sobre o acento (preto na posca amarela, branco nas demais). */
  onAccent?: string;
}

export const COLOR_THEMES: Record<string, ColorTheme> = {
  amarelo: {
    label: 'Amarelo posca',
    accent: '#F6E23A',
    accentStrong: '#5C5000',
    accentSoft: '#FBF3B8',
    accentOnDark: '#F6E23A',
    onAccent: '#16191B',
  },
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
  parabrisa: {
    label: 'Para-brisa (Archivo + letra de pincel)',
    display: "'Archivo', ui-sans-serif, sans-serif",
    body: "'Archivo', ui-sans-serif, sans-serif",
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&family=Permanent+Marker&display=swap',
  },
  moderno: {
    label: 'Moderno (Space Grotesk + Inter)',
    display: "'Space Grotesk', ui-sans-serif, sans-serif",
    body: "'Inter', ui-sans-serif, sans-serif",
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  },
  amigavel: {
    label: 'Amigável (Poppins + Inter)',
    display: "'Poppins', ui-sans-serif, sans-serif",
    body: "'Inter', ui-sans-serif, sans-serif",
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  },
  classico: {
    label: 'Clássico (Playfair Display + Source Sans 3)',
    display: "'Playfair Display', ui-serif, serif",
    body: "'Source Sans 3', ui-sans-serif, sans-serif",
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap',
  },
};

export const DEFAULT_COLOR_THEME = 'amarelo';
export const DEFAULT_FONT_THEME = 'parabrisa';
