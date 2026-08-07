// Design tokens - single source of truth for color/spacing/radius across the app.
// Swap these values to re-skin the app; nothing else should hardcode a color.

export const light = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  accent: '#2563EB',
  accentText: '#FFFFFF',
  success: '#16A34A',
  error: '#DC2626',
  disabled: '#D1D5DB',
};

export const dark = {
  background: '#121212',
  surface: '#1C1C1E',
  textPrimary: '#F2F2F2',
  textMuted: '#9CA3AF',
  border: '#2C2C2E',
  accent: '#2563EB',
  accentText: '#FFFFFF',
  success: '#16A34A',
  error: '#DC2626',
  disabled: '#3A3A3C',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const typography = {
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};
