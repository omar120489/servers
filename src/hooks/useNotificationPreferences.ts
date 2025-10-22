import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'notifications:preferences';

export type NotificationType = 'comment' | 'attachment' | 'notification' | 'email' | 'mention';

interface Preferences {
  mutedTypes: NotificationType[];
}

const defaultPreferences: Preferences = {
  mutedTypes: []
};

/**
 * Load preferences from localStorage
 */
function loadPreferences(): Preferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultPreferences;
    }
    const parsed = JSON.parse(stored);
    return {
      mutedTypes: Array.isArray(parsed.mutedTypes) ? parsed.mutedTypes : []
    };
  } catch (error) {
    console.error('[Preferences] Failed to load from localStorage:', error);
    return defaultPreferences;
  }
}

/**
 * Save preferences to localStorage
 */
function savePreferences(preferences: Preferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('[Preferences] Failed to save to localStorage:', error);
  }
}

/**
 * Hook to manage notification preferences
 *
 * Features:
 * - Mute/unmute specific notification types
 * - Persist preferences to localStorage
 * - Check if a type is muted
 * - Mute/unmute all types
 *
 * @example
 * ```tsx
 * const { mutedTypes, isMuted, toggleMute, muteAll, unmuteAll } = useNotificationPreferences();
 *
 * if (isMuted('comment')) {
 *   console.log('Comment notifications are muted');
 * }
 *
 * toggleMute('email'); // Mute or unmute email notifications
 * ```
 */
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  // Save to localStorage whenever preferences change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  /**
   * Check if a notification type is muted
   */
  const isMuted = useCallback(
    (type: NotificationType): boolean => {
      return preferences.mutedTypes.includes(type);
    },
    [preferences.mutedTypes]
  );

  /**
   * Toggle mute status for a notification type
   */
  const toggleMute = useCallback((type: NotificationType) => {
    setPreferences((prev) => {
      const mutedTypes = prev.mutedTypes.includes(type)
        ? prev.mutedTypes.filter((t) => t !== type)
        : [...prev.mutedTypes, type];
      return { mutedTypes };
    });
  }, []);

  /**
   * Mute all notification types
   */
  const muteAll = useCallback(() => {
    const allTypes: NotificationType[] = ['comment', 'attachment', 'notification', 'email', 'mention'];
    setPreferences({ mutedTypes: allTypes });
  }, []);

  /**
   * Unmute all notification types
   */
  const unmuteAll = useCallback(() => {
    setPreferences({ mutedTypes: [] });
  }, []);

  return {
    mutedTypes: preferences.mutedTypes,
    isMuted,
    toggleMute,
    muteAll,
    unmuteAll
  };
}

export default useNotificationPreferences;

