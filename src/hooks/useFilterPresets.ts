import { useState, useEffect } from 'react';
import type { FilterValues } from '../ui-component/FilterPanel';

export interface FilterPreset {
  name: string;
  filters: FilterValues;
}

/**
 * Hook to manage filter presets in localStorage
 * @param storageKey - localStorage key for this set of presets (e.g., 'deals-filter-presets')
 */
export function useFilterPresets(storageKey: string) {
  const [presets, setPresets] = useState<FilterPreset[]>([]);

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = globalThis.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as FilterPreset[];
        setPresets(parsed);
      }
    } catch (error) {
      console.error(`[useFilterPresets] Failed to load presets from ${storageKey}:`, error);
    }
  }, [storageKey]);

  // Save a new preset
  const savePreset = (name: string, filters: FilterValues) => {
    const newPreset: FilterPreset = { name, filters };
    const updated = [...presets, newPreset];
    setPresets(updated);
    try {
      globalThis.localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error(`[useFilterPresets] Failed to save preset to ${storageKey}:`, error);
    }
  };

  // Delete a preset
  const deletePreset = (name: string) => {
    const updated = presets.filter((p) => p.name !== name);
    setPresets(updated);
    try {
      globalThis.localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error(`[useFilterPresets] Failed to delete preset from ${storageKey}:`, error);
    }
  };

  // Clear all presets
  const clearPresets = () => {
    setPresets([]);
    try {
      globalThis.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(`[useFilterPresets] Failed to clear presets from ${storageKey}:`, error);
    }
  };

  return {
    presets,
    savePreset,
    deletePreset,
    clearPresets
  };
}


