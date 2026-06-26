export type AppCategory = 'game' | 'media' | 'system';

export interface AppItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconUrl: string;
  bgUrl: string;
  accentColor: string;
  category: AppCategory;
  publisher: string;
  rating: string;
  releaseYear: string;
  isInstalled: boolean;
}

export type LauncherSection = 'topNav' | 'appRow' | 'detailsHub';

export interface TopNavItem {
  id: string;
  label: string;
  icon: string;
  action?: () => void;
}

export interface FocusEngineConfig {
  damping: number;
  stiffness: number;
  mass?: number;
}
