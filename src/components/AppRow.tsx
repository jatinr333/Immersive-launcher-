import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { useLauncherStore } from '../store/useLauncherStore';
import { AppTile } from './AppTile';
import { AppItem } from '../types';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatList<AppItem>>(FlatList);

export const AppRow: React.FC = () => {
  const apps = useLauncherStore((state) => state.apps);
  const focusedApp = useLauncherStore((state) => state.focusedApp);
  const setFocusedApp = useLauncherStore((state) => state.setFocusedApp);
  const setCurrentSection = useLauncherStore((state) => state.setCurrentSection);
  const activeTab = useLauncherStore((state) => state.activeTab);

  const flatListRef = useRef<FlatList<AppItem>>(null);

  // Filter apps based on active category tab (Games vs Media vs System)
  const filteredApps = apps.filter((app) => {
    if (activeTab === 'games') {
      return app.category === 'game' || app.category === 'system';
    }
    return app.category === 'media' || app.category === 'system';
  });

  const handleFocusTile = useCallback(
    (app: AppItem, index: number) => {
      setFocusedApp(app);
      setCurrentSection('appRow');

      try {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // Centered alignment on TV screen
        });
      } catch (err) {
        console.warn('ScrollToIndex failed gracefully:', err);
      }
    },
    [setFocusedApp, setCurrentSection]
  );

  const handleSelectTile = useCallback((app: AppItem) => {
    console.log(`Launching application: ${app.title}`);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: AppItem; index: number }) => {
      const isFocused = focusedApp?.id === item.id;
      // Initial preferred TV focus on the 2nd item (index 1) or 1st item
      const hasInitialFocus = index === 1;

      return (
        <AppTile
          app={item}
          index={index}
          isFocused={isFocused}
          hasInitialFocus={hasInitialFocus}
          onFocusTile={handleFocusTile}
          onSelectTile={handleSelectTile}
        />
      );
    },
    [focusedApp?.id, handleFocusTile, handleSelectTile]
  );

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        ref={flatListRef}
        data={filteredApps}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.5,
            });
          }, 100);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    justifyContent: 'center',
    zIndex: 5,
  },
  listContent: {
    paddingHorizontal: 48,
    alignItems: 'center',
  },
});
