import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useLauncherStore } from '../store/useLauncherStore';
import { SPRING_CONFIG } from '../hooks/useTVFocusEngine';

interface ActionButtonProps {
  label: string;
  isPrimary?: boolean;
  onPressAction: () => void;
  onFocusAction: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  isPrimary,
  onPressAction,
  onFocusAction,
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const handleFocus = () => {
    scale.value = withSpring(1.08, SPRING_CONFIG);
    glow.value = withTiming(1, { duration: 150 });
    onFocusAction();
  };

  const handleBlur = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
    glow.value = withTiming(0, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: isPrimary ? 0.3 + glow.value * 0.5 : 0,
  }));

  return (
    <Pressable
      isTVSelectable={true}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPress={onPressAction}
      style={styles.buttonWrapper}
    >
      <Animated.View
        style={[
          styles.actionButton,
          isPrimary ? styles.primaryButton : styles.secondaryButton,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const AppDetailsHub: React.FC = () => {
  const focusedApp = useLauncherStore((state) => state.focusedApp);
  const setCurrentSection = useLauncherStore((state) => state.setCurrentSection);

  // Staggered Reanimated Shared Values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-15);

  const descOpacity = useSharedValue(0);
  const descTranslateY = useSharedValue(-15);

  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(-15);

  useEffect(() => {
    if (!focusedApp) return;

    // Reset initial states
    titleOpacity.value = 0;
    titleTranslateY.value = -12;

    descOpacity.value = 0;
    descTranslateY.value = -12;

    buttonsOpacity.value = 0;
    buttonsTranslateY.value = -12;

    // Staggered Entrance Animations
    titleOpacity.value = withTiming(1, { duration: 250 });
    titleTranslateY.value = withSpring(0, SPRING_CONFIG);

    descOpacity.value = withDelay(70, withTiming(1, { duration: 250 }));
    descTranslateY.value = withDelay(70, withSpring(0, SPRING_CONFIG));

    buttonsOpacity.value = withDelay(140, withTiming(1, { duration: 250 }));
    buttonsTranslateY.value = withDelay(140, withSpring(0, SPRING_CONFIG));
  }, [
    focusedApp?.id,
    titleOpacity,
    titleTranslateY,
    descOpacity,
    descTranslateY,
    buttonsOpacity,
    buttonsTranslateY,
  ]);

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const animatedDescStyle = useAnimatedStyle(() => ({
    opacity: descOpacity.value,
    transform: [{ translateY: descTranslateY.value }],
  }));

  const animatedButtonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const handleFocusHub = () => {
    setCurrentSection('detailsHub');
  };

  if (!focusedApp) return null;

  return (
    <View style={styles.container}>
      {/* Title & Badge Row */}
      <Animated.View style={[styles.titleRow, animatedTitleStyle]}>
        <Text style={styles.titleText}>{focusedApp.title}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{focusedApp.rating}</Text>
        </View>
        <Text style={styles.publisherText}>• {focusedApp.publisher}</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={animatedTitleStyle}>
        <Text style={styles.subtitleText}>{focusedApp.subtitle}</Text>
      </Animated.View>

      {/* Description */}
      <Animated.View style={[styles.descContainer, animatedDescStyle]}>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {focusedApp.description}
        </Text>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View style={[styles.actionsRow, animatedButtonsStyle]}>
        <ActionButton
          label={focusedApp.category === 'game' ? 'Play Game' : 'Open App'}
          isPrimary={true}
          onPressAction={() => console.log(`Playing ${focusedApp.title}`)}
          onFocusAction={handleFocusHub}
        />
        <ActionButton
          label="Explore Add-ons"
          isPrimary={false}
          onPressAction={() => console.log('Explore Add-ons')}
          onFocusAction={handleFocusHub}
        />
        <ActionButton
          label="•••"
          isPrimary={false}
          onPressAction={() => console.log('More options')}
          onFocusAction={handleFocusHub}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 48,
    paddingTop: 16,
    justifyContent: 'flex-start',
    zIndex: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  ratingBadge: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  publisherText: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitleText: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  descContainer: {
    maxWidth: 680,
    marginBottom: 32,
  },
  descriptionText: {
    color: '#E2E8F0',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  buttonWrapper: {
    borderRadius: 24,
  },
  actionButton: {
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  primaryButtonText: {
    color: '#0F1015',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
});
