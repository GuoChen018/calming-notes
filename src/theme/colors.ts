export const colors = {
  light: {
    // Calming, soft palette
    background: '#fefefe',
    surface: '#ffffff',
    surfaceSecondary: '#f8f9fa',
    
    text: {
      primary: '#2d3748',
      secondary: '#718096',
      muted: '#a0aec0',
    },
    
    accent: {
      primary: '#4299e1',   // Soft blue
      secondary: '#63b3ed', // Lighter blue
      success: '#48bb78',   // Soft green
      warning: '#ed8936',   // Soft orange
      error: '#f56565',     // Soft red
    },
    
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e0',
      dark: '#a0aec0',
    },
    
    editor: {
      background: '#ffffff',
      toolbar: '#f7fafc',
      selection: '#bee3f8',
    },
  },
  
  dark: {
    // Dark mode with calming tones
    background: '#1a202c',
    surface: '#2d3748',
    surfaceSecondary: '#4a5568',
    
    text: {
      primary: '#f7fafc',
      secondary: '#e2e8f0',
      muted: '#a0aec0',
    },
    
    accent: {
      primary: '#63b3ed',   // Bright blue for dark mode
      secondary: '#90cdf4', // Lighter blue
      success: '#68d391',   // Bright green
      warning: '#fbb040',   // Bright orange
      error: '#fc8181',     // Bright red
    },
    
    border: {
      light: '#4a5568',
      medium: '#718096',
      dark: '#a0aec0',
    },
    
    editor: {
      background: '#2d3748',
      toolbar: '#4a5568',
      selection: '#2b6cb0',
    },
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof colors.light;
