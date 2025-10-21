import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';

type SetState<T> = Dispatch<SetStateAction<T>>;

export interface LocalStorageActions<T> {
  state: T;
  setState: SetState<T>;
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  resetState: () => void;
}

// ==============================|| HOOKS - LOCAL STORAGE ||============================== //

export function useLocalStorage<T extends Record<string, unknown>>(
  key: string,
  defaultValue: T
): LocalStorageActions<T> {
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return defaultValue;
    }
  };

  const [state, setState] = useState<T>(() => readValue());

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn(`Error setting localStorage key "${key}":`, err);
    }
  }, [key, state]);

  const setField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setState((prev) => ({
        ...prev,
        [field]: value
      }));
    },
    [setState]
  );

  const resetState = useCallback(() => {
    setState(defaultValue);
    try {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    } catch (err) {
      console.warn(`Error resetting localStorage key "${key}":`, err);
    }
  }, [defaultValue, key]);

  return { state, setState, setField, resetState };
}
