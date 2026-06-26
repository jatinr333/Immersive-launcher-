import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { useGlobalTVRouter } from './src/hooks/useTVFocusEngine';
import { HeroBackground } from './src/components/HeroBackground';
import { TopNavBar } from './src/components/TopNavBar';
import { AppRow } from './src/components/AppRow';
import { AppDetailsHub } from './src/components/AppDetailsHub';

export default function App(): React.JSX.Element {
  // Initialize Global D-Pad Navigation Engine
  useGlobalTVRouter();

  return (
    <View style={styles.rootContainer}>
      <StatusBar hidden={true} translucent={true} backgroundColor="transparent" />

      {/* Layer 1: Reactive Fullscreen Crossfading Hero Background */}
      <HeroBackground />

      {/* Layer 2: UI/UX Overlay (Overscan Safe Zones Included) */}
      <View style={styles.uiOverlay}>
        {/* Top Bar: Search, Settings, Profile, Clock */}
        <TopNavBar />

        {/* Middle Roster: Spring Animated Horizontal Game Tiles */}
        <AppRow />

        {/* Bottom Content Hub: Title, Description, Play Actions */}
        <AppDetailsHub />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#0F1015',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  uiOverlay: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // Android TV / tvOS standard 5% overscan safety margin
    paddingVertical: 27,
  },
});
