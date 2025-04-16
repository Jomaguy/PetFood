// Breakpoints matching Tailwind's default breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Media query helper function
export const mediaQuery = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
};

// Spacing system (in pixels) that aligns with Tailwind's default spacing scale
export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
};

// Responsive helper to apply different styles based on screen size
export const getResponsiveValue = <T>(
  values: {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
  },
  defaultValue?: T
): T | undefined => {
  // In a client-side context, we would check the window width
  // and return the appropriate value. For SSR-compatibility,
  // we're just returning the most specific defined value.
  return (
    values['2xl'] ??
    values.xl ??
    values.lg ??
    values.md ??
    values.sm ??
    values.base ??
    defaultValue
  );
};

// Check if we're running on the client side
export const isClient = typeof window !== 'undefined';

// Hook to get current breakpoint (would be implemented with useEffect and useState in a React component)
// This is just a type definition for reference
export type CurrentBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Function to generate responsive class names
export const createResponsiveClasses = (
  classPrefix: string,
  values: {
    base?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    '2xl'?: string | number;
  }
): string => {
  const classes: string[] = [];

  if (values.base !== undefined) {
    classes.push(`${classPrefix}-${values.base}`);
  }
  if (values.sm !== undefined) {
    classes.push(`sm:${classPrefix}-${values.sm}`);
  }
  if (values.md !== undefined) {
    classes.push(`md:${classPrefix}-${values.md}`);
  }
  if (values.lg !== undefined) {
    classes.push(`lg:${classPrefix}-${values.lg}`);
  }
  if (values.xl !== undefined) {
    classes.push(`xl:${classPrefix}-${values.xl}`);
  }
  if (values['2xl'] !== undefined) {
    classes.push(`2xl:${classPrefix}-${values['2xl']}`);
  }

  return classes.join(' ');
}; 