import 'styled-components';
import { colors } from './colors';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors;
    fonts: {
      body: string;
      heading: string;
      monospace: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    space: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    borders: {
      none: string;
      thin: string;
      medium: string;
      thick: string;
    };
    radii: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      inner: string;
    };
    components: {
      button: {
        primary: {
          bg: string;
          color: string;
          hoverBg: string;
          activeBg: string;
        };
        secondary: {
          bg: string;
          color: string;
          hoverBg: string;
          activeBg: string;
        };
        outline: {
          bg: string;
          color: string;
          borderColor: string;
          hoverBg: string;
        };
      };
      card: {
        bg: string;
        borderColor: string;
        shadow: string;
      };
      input: {
        bg: string;
        borderColor: string;
        focusBorderColor: string;
        placeholderColor: string;
      };
    };
  }
} 