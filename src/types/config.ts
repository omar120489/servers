import type { AppConfig } from 'config';
import type { LocalStorageActions } from 'hooks/useLocalStorage';

export type ConfigContextType = LocalStorageActions<AppConfig>;
