import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useLauncherStore } from '../store/useLauncherStore';

export const HeroBackground: React.FC = () => {
  const focusedApp = useLauncherStore((state) => state.focusedApp);
  const [currentBgUrl, setCurrentBgUrl] = useState<string>(focusedApp?.bgUrl || '');
  const [prevBgUrl, setPrevBgUrl] = useState<string>(focusedApp?.bgUrl || '');

  const crossfadeOpacity = useSharedValue(1);

  useEffect(() => {
    if (!focusedApp?.bgUrl || focusedApp.bgUrl === currentBgUrl) return;

    setPrevBgUrl(currentBgUrl);
    setCurrentBgUrl(focusedApp.bgUrl);
    crossfadeOpacity.value = 0;
    crossfadeOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [focusedApp?.bgUrl, currentBgUrl, crossfadeOpacity]);

  const animatedTopLayerStyle = useAnimatedStyle(() => ({
    opacity: crossfadeOpacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Base Layer (Previous Background) */}
      {prevBgUrl ? (
        <Image
          source={{ uri: prevBgUrl }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      ) : null}

      {/* Crossfading Top Layer (Current Background) */}
      {currentBgUrl ? (
        <Animated.Image
          source={{ uri: currentBgUrl }}
          style={[StyleSheet.absoluteFillObject, animatedTopLayerStyle]}
          resizeMode="cover"
        />
      ) : null}

      {/* Vignette / Dark Gradients Overlay for Text Readability */}
      <View style={styles.topVignette} />
      <View style={styles.bottomVignette} />
      <View style={styles.radialTint} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F1015',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 420,
    backgroundColor: 'rgba(10, 11, 16, 0.88)',
  },
  radialTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
});
