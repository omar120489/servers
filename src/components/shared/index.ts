/**
 * Shared Component Library
 * 
 * Barrel export for all shared/reusable components.
 * Import from here to use shared components across the application.
 * 
 * @example
 * ```tsx
 * import { SearchBar, LoadingState, PageHeader } from 'components/shared';
 * ```
 */

export { default as SearchBar } from './SearchBar';
export type { SearchBarProps } from './SearchBar';

export { default as LoadingState } from './LoadingState';
export type { LoadingStateProps } from './LoadingState';

export { default as ErrorState } from './ErrorState';
export type { ErrorStateProps } from './ErrorState';

export { default as PageHeader } from './PageHeader';
export type { PageHeaderProps } from './PageHeader';

