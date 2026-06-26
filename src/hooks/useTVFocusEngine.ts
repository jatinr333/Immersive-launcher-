import { useEffect, useRef, useCallback } from 'react';
import { useTVEventHandler } from 'react-native';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useLauncherStore } from '../store/useLauncherStore';
import { LauncherSection } from '../types';

export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export interface TVFocusEngineReturn {
  scale: ReturnType<typeof useSharedValue<number>>;
  borderGlow: ReturnType<typeof useSharedValue<number>>;
  handleFocus: () => void;
  handleBlur: () => void;
}

/**
 * Custom hook integrating Reanimated spring physics and TVOS D-Pad navigation.
 * Handles TV event monitoring and provides spring animation shared values for UI tiles.
 */
export function useTVFocusEngine(
  onFocusCallback?: () => void,
  onBlurCallback?: () => void
): TVFocusEngineReturn {
  const scale = useSharedValue(0.95);
  const borderGlow = useSharedValue(0);

  const handleFocus = useCallback(() => {
    scale.value = withSpring(1.18, SPRING_CONFIG);
    borderGlow.value = withTiming(1, { duration: 200 });
    onFocusCallback?.();
  }, [scale, borderGlow, onFocusCallback]);

  const handleBlur = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
    borderGlow.value = withTiming(0, { duration: 150 });
    onBlurCallback?.();
  }, [scale, borderGlow, onBlurCallback]);

  return {
    scale,
    borderGlow,
    handleFocus,
    handleBlur,
  };
}

/**
 * Global TV D-Pad directional routing hook.
 * Manages vertical transitions between Top Navigation, App Row, and Details Hub.
 */
export function useGlobalTVRouter() {
  const currentSection = useLauncherStore((state) => state.currentSection);
  const setCurrentSection = useLauncherStore((state) => state.setCurrentSection);
  const lastPressTime = useRef<number>(0);

  const handleTVEvent = useCallback((evt: { eventType?: string }) => {
    if (!evt || !evt.eventType) return;

    const now = Date.now();
    if (now - lastPressTime.current < 150) return; // Debounce rapid D-Pad presses

    const { eventType } = evt;

    if (eventType === 'up') {
      lastPressTime.current = now;
      if (currentSection === 'detailsHub') {
        setCurrentSection('appRow');
      } else if (currentSection === 'appRow') {
        setCurrentSection('topNav');
      }
    } else if (eventType === 'down') {
      lastPressTime.current = now;
      if (currentSection === 'topNav') {
        setCurrentSection('appRow');
      } else if (currentSection === 'appRow') {
        setCurrentSection('detailsHub');
      }
    }
  }, [currentSection, setCurrentSection]);

  useTVEventHandler(handleTVEvent);
}
