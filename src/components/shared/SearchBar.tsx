/**
 * SearchBar Component
 * 
 * A reusable search input with icon that follows Material-UI design patterns.
 * Extracted from common pattern used across 15+ pages.
 * 
 * @example
 * ```tsx
 * <SearchBar
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Search leads by name, email, or company..."
 * />
 * ```
 */

import React from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the search bar should take full width */
  fullWidth?: boolean;
  /** Size of the search bar */
  size?: 'small' | 'medium';
  /** Additional props to pass to the underlying TextField */
  TextFieldProps?: Partial<Omit<TextFieldProps, 'value' | 'onChange'>>;
}

/**
 * SearchBar component for consistent search UI across the application.
 * 
 * Features:
 * - Search icon prefix
 * - Customizable placeholder
 * - Full width or fixed width
 * - Accessible with proper ARIA labels
 * - Consistent styling
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  fullWidth = true,
  size = 'small',
  TextFieldProps: textFieldProps,
}: SearchBarProps) {
  return (
    <TextField
      fullWidth={fullWidth}
      size={size}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      inputProps={{
        'aria-label': placeholder,
      }}
      {...textFieldProps}
    />
  );
}

