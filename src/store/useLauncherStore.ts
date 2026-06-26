import { create } from 'zustand';
import { AppItem, LauncherSection } from '../types';

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'ps-store',
    title: 'PlayStation Store',
    subtitle: 'Official Store',
    description: 'Discover the latest games, exclusive discounts, pre-orders, and add-ons for your console.',
    iconUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&auto=format&fit=crop&q=80',
    bgUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&auto=format&fit=crop&q=80',
    accentColor: '#0070D1',
    category: 'system',
    publisher: 'Sony Interactive Entertainment',
    rating: 'E',
    releaseYear: '2026',
    isInstalled: true,
  },
  {
    id: 'spiderman-2',
    title: "Marvel's Spider-Man 2",
    subtitle: 'PS5 Exclusive',
    description: 'Spider-Men Peter Parker and Miles Morales return for an exciting new adventure in the critically acclaimed franchise.',
    iconUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&auto=format&fit=crop&q=80',
    bgUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1920&auto=format&fit=crop&q=80',
    accentColor: '#E62429',
    category: 'game',
    publisher: 'Insomniac Games',
    rating: 'T',
    releaseYear: '2023',
    isInstalled: true,
  },
  {
    id: 'god-of-war',
    title: 'God of War Ragnarök',
    subtitle: 'Valhalla Edition',
    description: 'Fimbulwinter is well underway. Kratos and Atreus must journey to each of the Nine Realms in search of answers.',
    iconUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&auto=format&fit=crop&q=80',
    bgUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80',
    accentColor: '#4A6B82',
    category: 'game',
    publisher: 'Santa Monica Studio',
    rating: 'M',
    releaseYear: '2022',
    isInstalled: true,
  },
  {
    id: 'horizon-fw',
    title: 'Horizon Forbidden West',
    subtitle: 'Burning Shores',
    description: 'Join Aloy as she braves the Forbidden West—a majestic but dangerous frontier that conceals mysterious new threats.',
    iconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
    bgUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80',
    accentColor: '#38B6FF',
    category: 'game',
    publisher: 'Guerrilla Games',
    rating: 'T',
    releaseYear: '2022',
    isInstalled: true,
  },
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077: Phantom Liberty',
    subtitle: 'Ultimate Edition',
    description: 'An open-world, action-adventure RPG set in the dark future of Night City, a megalopolis obsessed with power and body modification.',
    iconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    bgUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&auto=format&fit=crop&q=80',
    accentColor: '#FEE801',
    category: 'game',
    publisher: 'CD PROJEKT RED',
    rating: 'M',
    releaseYear: '2023',
    isInstalled: true,
  },
  {
    id: 'gran-turismo',
    title: 'Gran Turismo 7',
    subtitle: 'The Real Driving Simulator',
    description: 'Whether you are a competitive or casual racer, collector, tuner, livery designer, or photographer, find your line with a staggering collection of game modes.',
    iconUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop&q=80',
    bgUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&auto=format&fit=crop&q=80',
    accentColor: '#C1121F',
    category: 'game',
    publisher: 'Polyphony Digital',
    rating: 'E',
    releaseYear: '2022',
    isInstalled: true,
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    subtitle: 'Shadow of the Erdtree',
    description: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
    iconUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    bgUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&auto=format&fit=crop&q=80',
    accentColor: '#D4AF37',
    category: 'game',
    publisher: 'FromSoftware / Bandai Namco',
    rating: 'M',
    releaseYear: '2022',
    isInstalled: true,
  },
  {
    id: 'netflix',
    title: 'Netflix',
    subtitle: 'Streaming App',
    description: 'Watch award-winning TV shows, movies, documentaries, and stand-up specials across a wide variety of genres.',
    iconUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&auto=format&fit=crop&q=80',
    bgUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&auto=format&fit=crop&q=80',
    accentColor: '#E50914',
    category: 'media',
    publisher: 'Netflix, Inc.',
    rating: 'T',
    releaseYear: '2020',
    isInstalled: true,
  },
];

interface LauncherStore {
  apps: AppItem[];
  focusedApp: AppItem;
  currentSection: LauncherSection;
  focusedTopNavIndex: number;
  activeTab: 'games' | 'media';
  setFocusedApp: (app: AppItem) => void;
  setCurrentSection: (section: LauncherSection) => void;
  setFocusedTopNavIndex: (index: number) => void;
  setActiveTab: (tab: 'games' | 'media') => void;
}

export const useLauncherStore = create<LauncherStore>((set) => ({
  apps: INITIAL_APPS,
  focusedApp: INITIAL_APPS[1], // Start focused on Spider-Man 2
  currentSection: 'appRow',
  focusedTopNavIndex: -1,
  activeTab: 'games',
  setFocusedApp: (app) => set({ focusedApp: app }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setFocusedTopNavIndex: (index) => set({ focusedTopNavIndex: index }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
