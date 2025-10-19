/**
 * Material Design 3-aligned Typography System
 * 
 * Scale: Display/Headline/Title/Body/Label (each in L/M/S)
 * Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
 * Contrast: WCAG 2.1 AA compliant (≥4.5:1 for normal, ≥3:1 for large)
 * Capitalization: Sentence-case for all UI text
 * 
 * @see https://m3.material.io/styles/typography/type-scale-tokens
 */

import { TypographyOptions } from '@mui/material/styles/createTypography';

/**
 * Typography tokens mapped to MUI variants
 * 
 * Hierarchy:
 * - h1-h3: Page and section titles (Title/L-M-S)
 * - h6: Subsection headers (Title/S)
 * - subtitle1-2: Labels and emphasized content (Title/M, Label/L)
 * - body1-2: Default content (Body/L-M)
 * - caption: Metadata, timestamps (Caption)
 * - button: Interactive elements (Label/L)
 */
export const typography: TypographyOptions = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  
  // Page title (optional, for major views)
  h1: {
    fontSize: '2rem',        // 32px
    lineHeight: 40 / 32,     // 1.25
    fontWeight: 600,         // Semibold
    letterSpacing: '-0.01em',
  },
  
  // Section group headers
  h2: {
    fontSize: '1.5rem',      // 24px
    lineHeight: 32 / 24,     // 1.333
    fontWeight: 600,         // Semibold
    letterSpacing: '-0.005em',
  },
  
  // Title/L - Primary section headers
  h3: {
    fontSize: '1.375rem',    // 22px
    lineHeight: 28 / 22,     // 1.273
    fontWeight: 600,         // Semibold
  },
  
  // Title/M - Card titles, dialog headers
  h4: {
    fontSize: '1.25rem',     // 20px
    lineHeight: 28 / 20,     // 1.4
    fontWeight: 600,         // Semibold
  },
  
  // Title/M - Smaller section headers
  h5: {
    fontSize: '1rem',        // 16px
    lineHeight: 24 / 16,     // 1.5
    fontWeight: 600,         // Semibold
  },
  
  // Title/S - Subsection headers, table groups
  h6: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 20 / 14,     // 1.429
    fontWeight: 600,         // Semibold
  },
  
  // Title/M - Field labels, emphasized content
  subtitle1: {
    fontSize: '1rem',        // 16px
    lineHeight: 24 / 16,     // 1.5
    fontWeight: 500,         // Medium
  },
  
  // Label/M - Secondary labels
  subtitle2: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 20 / 14,     // 1.429
    fontWeight: 500,         // Medium
  },
  
  // Body/L - Large body text
  body1: {
    fontSize: '1rem',        // 16px
    lineHeight: 24 / 16,     // 1.5
    fontWeight: 400,         // Regular
  },
  
  // Body/M - Default body text
  body2: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 20 / 14,     // 1.429
    fontWeight: 400,         // Regular
  },
  
  // Caption - Metadata, timestamps, helper text
  caption: {
    fontSize: '0.75rem',     // 12px
    lineHeight: 16 / 12,     // 1.333
    fontWeight: 400,         // Regular
  },
  
  // Overline - All caps labels (use sparingly)
  overline: {
    fontSize: '0.6875rem',   // 11px
    lineHeight: 16 / 11,     // 1.455
    fontWeight: 500,         // Medium
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
  
  // Button - Interactive elements (Label/L)
  button: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 20 / 14,     // 1.429
    fontWeight: 500,         // Medium
    textTransform: 'none' as const,   // Sentence-case
    letterSpacing: '0.01em',
  },
};

/**
 * Component-level typography overrides
 * Ensures consistent typography without page-by-page fixes
 */
export const typographyComponents: any = {
  // Table headers: always semibold
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: 20 / 14,
          letterSpacing: '0.01em',
        },
      },
    },
  },
  
  // Table cells: body text
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        lineHeight: 20 / 14,
      },
      body: {
        fontWeight: 400,
      },
    },
  },
  
  // Buttons: medium weight, sentence-case
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        textTransform: 'none',
        fontSize: '0.875rem',
        lineHeight: 20 / 14,
      },
    },
  },
  
  // Chips: medium weight labels
  MuiChip: {
    styleOverrides: {
      label: {
        fontWeight: 500,
        fontSize: '0.8125rem', // 13px
        lineHeight: 18 / 13,
      },
      labelSmall: {
        fontSize: '0.75rem', // 12px
        lineHeight: 16 / 12,
      },
    },
  },
  
  // Menu items: body text
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        lineHeight: 20 / 14,
        fontWeight: 400,
      },
    },
  },
  
  // Dialog titles: Title/M
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.25rem',
        lineHeight: 28 / 20,
        fontWeight: 600,
      },
    },
  },
  
  // Input labels: Label/M
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        lineHeight: 20 / 14,
        fontWeight: 500,
      },
    },
  },
  
  // Form helper text: Caption
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: '0.75rem',
        lineHeight: 16 / 12,
        fontWeight: 400,
      },
    },
  },
  
  // Tabs: Label/L
  MuiTab: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        lineHeight: 20 / 14,
        fontWeight: 500,
        textTransform: 'none',
      },
    },
  },
  
  // Breadcrumbs: Body/M
  MuiBreadcrumbs: {
    styleOverrides: {
      li: {
        fontSize: '0.875rem',
        lineHeight: 20 / 14,
      },
    },
  },
  
  // List item text: Body/M
  MuiListItemText: {
    styleOverrides: {
      primary: {
        fontSize: '0.875rem',
        lineHeight: 20 / 14,
        fontWeight: 400,
      },
      secondary: {
        fontSize: '0.75rem',
        lineHeight: 16 / 12,
        fontWeight: 400,
      },
    },
  },
};

/**
 * Typography usage guidelines
 * 
 * DO:
 * - Use max 2 heading levels per card/panel (e.g., h3 + h6)
 * - Use max 3 weights per page (400/500/600)
 * - Use sentence-case for all UI text
 * - Ensure ≥4.5:1 contrast for body text, ≥3:1 for large text
 * - Use semantic HTML tags (h1-h6, p) with Typography component
 * 
 * DON'T:
 * - Use body2 as a header → use h6 or subtitle1
 * - Mix label styles in body cells
 * - Use bold (700) except for rare emphasis
 * - Use all-caps except for overline variant
 * - Override fontWeight inline unless semantic (e.g., bold for emphasis)
 * 
 * HIERARCHY PATTERNS:
 * 
 * Page structure:
 * - h4: Page title
 * - body2: Page description
 * - h6: Section headers
 * - subtitle1: Field labels
 * - body2: Content
 * - caption: Metadata
 * 
 * Cards:
 * - h6: Card title
 * - body2: Card content
 * - caption: Card footer/metadata
 * 
 * Tables:
 * - TableCell (head): Auto-styled to 600 weight
 * - body2: Cell content
 * - caption: Inline metadata
 * 
 * Dialogs:
 * - DialogTitle: Auto-styled to h4 equivalent
 * - subtitle1: Section labels
 * - body2: Content
 * - caption: Helper text
 */

export default typography;
