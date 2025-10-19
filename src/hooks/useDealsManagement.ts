/**
 * useDealsManagement Hook
 * 
 * Custom hook that encapsulates all deals management logic:
 * - Filtering, sorting, searching
 * - Selection management
 * - Summary calculations
 * 
 * Extracted from Deals page to reduce complexity.
 */

import { useState, useMemo } from 'react';
import type { Deal } from '../services/deals.api';

export type SortOption =
  | 'value-desc'
  | 'value-asc'
  | 'title-asc'
  | 'probability-desc'
  | 'date-asc';

export function useDealsManagement(deals: Deal[]) {
  // Search & Filters
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  // Sorting
  const [sortBy, setSortBy] = useState<SortOption>('value-desc');

  // Selection
  const [selectedDeals, setSelectedDeals] = useState<number[]>([]);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Search filter
      const searchMatch =
        search === '' ||
        deal.title.toLowerCase().includes(search.toLowerCase()) ||
        deal.company.toLowerCase().includes(search.toLowerCase()) ||
        deal.contact.toLowerCase().includes(search.toLowerCase());

      // Stage filter
      const stageMatch = stageFilter === 'all' || deal.stage === stageFilter;

      // Value range filter
      const minVal = minValue ? parseFloat(minValue) : 0;
      const maxVal = maxValue ? parseFloat(maxValue) : Infinity;
      const valueMatch = deal.value >= minVal && deal.value <= maxVal;

      return searchMatch && stageMatch && valueMatch;
    });
  }, [deals, search, stageFilter, minValue, maxValue]);

  // Sort deals
  const sortedDeals = useMemo(() => {
    const sorted = [...filteredDeals];
    switch (sortBy) {
      case 'value-desc':
        return sorted.sort((a, b) => b.value - a.value);
      case 'value-asc':
        return sorted.sort((a, b) => a.value - b.value);
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'probability-desc':
        return sorted.sort((a, b) => b.probability - a.probability);
      case 'date-asc':
        return sorted.sort(
          (a, b) =>
            new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime()
        );
      default:
        return sorted;
    }
  }, [filteredDeals, sortBy]);

  // Calculate summary stats
  const totalValue = useMemo(() => {
    return sortedDeals.reduce((sum, deal) => sum + deal.value, 0);
  }, [sortedDeals]);

  const weightedValue = useMemo(() => {
    return sortedDeals.reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);
  }, [sortedDeals]);

  const avgProbability = useMemo(() => {
    if (sortedDeals.length === 0) return 0;
    return sortedDeals.reduce((sum, deal) => sum + deal.probability, 0) / sortedDeals.length;
  }, [sortedDeals]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedDeals.length === sortedDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(sortedDeals.map((deal) => deal.id as number));
    }
  };

  const handleSelectDeal = (dealId: number) => {
    setSelectedDeals((prev) =>
      prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev, dealId]
    );
  };

  const clearSelection = () => {
    setSelectedDeals([]);
  };

  // Filter handlers
  const handleResetFilters = () => {
    setStageFilter('all');
    setMinValue('');
    setMaxValue('');
  };

  return {
    // State
    search,
    stageFilter,
    minValue,
    maxValue,
    sortBy,
    selectedDeals,

    // Computed
    sortedDeals,
    totalValue,
    weightedValue,
    avgProbability,

    // Setters
    setSearch,
    setStageFilter,
    setMinValue,
    setMaxValue,
    setSortBy,

    // Handlers
    handleSelectAll,
    handleSelectDeal,
    clearSelection,
    handleResetFilters,
  };
}

