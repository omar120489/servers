/**
 * useLeadsManagement Hook
 * 
 * Custom hook that encapsulates all leads management logic:
 * - Filtering, sorting, searching
 * - Selection management
 * - Bulk operations
 * - View persistence
 * 
 * Extracted from Leads page to reduce complexity.
 */

import { useState, useMemo, useEffect } from 'react';
import type { Lead } from '../types/crm';

export type SortOption =
  | 'score-desc'
  | 'score-asc'
  | 'name-asc'
  | 'name-desc'
  | 'company-asc'
  | 'date-desc';

interface ViewDef {
  label: string;
  filter: (lead: Lead) => boolean;
  sort: SortOption;
}

const SAVED_VIEWS: Record<string, ViewDef> = {
  all: {
    label: 'All leads',
    filter: () => true,
    sort: 'score-desc',
  },
  'new-this-week': {
    label: 'New this week',
    filter: (lead) => {
      if (!lead.created_at) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(lead.created_at) > weekAgo;
    },
    sort: 'date-desc',
  },
  'no-reply-3d': {
    label: 'No reply 3+ days',
    filter: (lead) => {
      if (!lead.updated_at) return lead.status === 'contacted';
      const daysSince = Math.floor(
        (Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSince >= 3 && lead.status !== 'converted';
    },
    sort: 'date-desc',
  },
  'high-score-uncontacted': {
    label: 'Score ≥80 & uncontacted',
    filter: (lead) => (lead.score ?? 0) >= 80 && lead.status === 'new',
    sort: 'score-desc',
  },
  'trial-started': {
    label: 'Trial started (7 days)',
    filter: (lead) => {
      if (!lead.created_at) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lead.status === 'qualified' && new Date(lead.created_at) > weekAgo;
    },
    sort: 'date-desc',
  },
};

// LocalStorage keys
const VIEW_KEY = 'leads:view';
const CUSTOM_VIEWS_KEY = 'leads:customViews';

export function useLeadsManagement(leads: Lead[]) {
  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);

  // Sorting
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');

  // Selection
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  // Views
  const [currentView, setCurrentView] = useState<string>(() => {
    return localStorage.getItem(VIEW_KEY) || 'all';
  });

  const [customViews, setCustomViews] = useState<Record<string, ViewDef>>(() => {
    try {
      return JSON.parse(localStorage.getItem(CUSTOM_VIEWS_KEY) || '{}');
    } catch {
      return {};
    }
  });

  // Persist view selection
  useEffect(() => {
    localStorage.setItem(VIEW_KEY, currentView);
  }, [currentView]);

  // Persist custom views
  useEffect(() => {
    localStorage.setItem(CUSTOM_VIEWS_KEY, JSON.stringify(customViews));
  }, [customViews]);

  // Get all views (built-in + custom)
  const allViews = useMemo(() => ({ ...SAVED_VIEWS, ...customViews }), [customViews]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    const viewConfig = allViews[currentView] || SAVED_VIEWS.all;

    return leads.filter((lead) => {
      // Apply saved view filter first
      if (!viewConfig.filter(lead)) return false;

      // Search filter
      const searchMatch =
        search === '' ||
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.company?.toLowerCase().includes(search.toLowerCase());

      // Status filter
      const statusMatch = statusFilter === 'all' || lead.status === statusFilter;

      // Score range filter
      const score = lead.score ?? 0;
      const scoreMatch = score >= scoreRange[0] && score <= scoreRange[1];

      return searchMatch && statusMatch && scoreMatch;
    });
  }, [leads, search, statusFilter, scoreRange, currentView, allViews]);

  // Sort leads
  const sortedLeads = useMemo(() => {
    const sorted = [...filteredLeads];
    switch (sortBy) {
      case 'score-desc':
        return sorted.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      case 'score-asc':
        return sorted.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
      case 'name-asc':
        return sorted.sort((a, b) =>
          `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
        );
      case 'name-desc':
        return sorted.sort((a, b) =>
          `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`)
        );
      case 'company-asc':
        return sorted.sort((a, b) => (a.company ?? '').localeCompare(b.company ?? ''));
      case 'date-desc':
        return sorted.sort((a, b) => {
          const aId = typeof a.id === 'number' ? a.id : 0;
          const bId = typeof b.id === 'number' ? b.id : 0;
          return bId - aId;
        });
      default:
        return sorted;
    }
  }, [filteredLeads, sortBy]);

  // Calculate summary stats
  const totalValue = useMemo(() => {
    // Mock: estimate value based on score (in reality, this would come from deal value)
    return sortedLeads.reduce((sum, lead) => sum + (lead.score ?? 0) * 1000, 0);
  }, [sortedLeads]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedLeads.length === sortedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(sortedLeads.map((lead) => lead.id as number));
    }
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const clearSelection = () => {
    setSelectedLeads([]);
  };

  // Filter handlers
  const handleResetFilters = () => {
    setStatusFilter('all');
    setScoreRange([0, 100]);
  };

  // View handlers
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    // Auto-apply the view's default sort
    const viewConfig = allViews[view];
    if (viewConfig) {
      setSortBy(viewConfig.sort);
    }
  };

  return {
    // State
    search,
    statusFilter,
    scoreRange,
    sortBy,
    selectedLeads,
    currentView,
    allViews,

    // Computed
    sortedLeads,
    totalValue,

    // Setters
    setSearch,
    setStatusFilter,
    setScoreRange,
    setSortBy,

    // Handlers
    handleSelectAll,
    handleSelectLead,
    clearSelection,
    handleResetFilters,
    handleViewChange,
  };
}

