import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AppItem } from '../types';
import { SPRING_CONFIG } from '../hooks/useTVFocusEngine';

interface AppTileProps {
  app: AppItem;
  index: number;
  isFocused: boolean;
  hasInitialFocus: boolean;
  onFocusTile: (app: AppItem, index: number) => void;
  onSelectTile: (app: AppItem) => void;
}

export const AppTile: React.FC<AppTileProps> = ({
  app,
  index,
  isFocused,
  hasInitialFocus,
  onFocusTile,
  onSelectTile,
}) => {
  const scale = useSharedValue(isFocused ? 1.18 : 0.95);
  const opacity = useSharedValue(isFocused ? 1 : 0.8);
  const glowOpacity = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.18 : 0.95, SPRING_CONFIG);
    opacity.value = withTiming(isFocused ? 1 : 0.8, { duration: 200 });
    glowOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, scale, opacity, glowOpacity]);

  const handleFocus = () => {
    onFocusTile(app, index);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Pressable
      isTVSelectable={true}
      hasTVPreferredFocus={hasInitialFocus}
      onFocus={handleFocus}
      onPress={() => onSelectTile(app)}
      style={styles.pressableContainer}
    >
      <Animated.View style={[styles.tileContainer, animatedStyle]}>
        {/* Outer Glow Border Effect */}
        <Animated.View style={[styles.glowBorder, animatedGlowStyle]} />

        {/* Tile Content */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: app.iconUrl }} style={styles.appIcon} />
          <View style={[styles.categoryBadge, { backgroundColor: app.accentColor }]}>
            <Text style={styles.badgeText}>
              {app.category === 'game' ? 'PS5' : 'APP'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    marginHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  tileContainer: {
    width: 124,
    height: 124,
    borderRadius: 28,
    position: 'relative',
    backgroundColor: '#1E232F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    zIndex: 2,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
  },
  appIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
