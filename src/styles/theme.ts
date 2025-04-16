import { colors } from './colors';

/**
 * PetFood App Theme
 * Based on light brown and dark green color scheme
 */
export const theme = {
  colors,
  
  // Typography
  fonts: {
    body: "'Nunito', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    heading: "'Nunito', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    monospace: "'Courier New', Courier, monospace",
  },
  
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',      // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  // Spacing
  space: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem',   // 48px
  },
  
  // Borders
  borders: {
    none: 'none',
    thin: '1px solid',
    medium: '2px solid',
    thick: '4px solid',
  },
  
  // Border radius
  radii: {
    none: '0',
    sm: '0.125rem',  // 2px
    md: '0.25rem',   // 4px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.07)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },
  
  // Component-specific themes
  components: {
    button: {
      primary: {
        bg: colors.primaryGreen,
        color: colors.white,
        hoverBg: colors.primaryGreenDark,
        activeBg: colors.primaryGreenDark,
      },
      secondary: {
        bg: colors.primaryBrown,
        color: colors.white,
        hoverBg: colors.primaryBrownDark,
        activeBg: colors.primaryBrownDark,
      },
      outline: {
        bg: 'transparent',
        color: colors.primaryGreen,
        borderColor: colors.primaryGreen,
        hoverBg: 'rgba(46, 94, 78, 0.1)',
      },
    },
    card: {
      bg: colors.cardBackground,
      borderColor: colors.gray200,
      shadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    input: {
      bg: colors.white,
      borderColor: colors.gray300,
      focusBorderColor: colors.primaryGreen,
      placeholderColor: colors.gray400,
    },
  },
}; 