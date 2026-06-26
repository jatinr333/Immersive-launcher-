import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useLauncherStore } from '../store/useLauncherStore';
import { SPRING_CONFIG } from '../hooks/useTVFocusEngine';

interface TopNavButtonProps {
  label?: string;
  icon?: string;
  isAvatar?: boolean;
  avatarUrl?: string;
  isActive?: boolean;
  onSelect: () => void;
  onFocusItem: () => void;
}

const TopNavButton: React.FC<TopNavButtonProps> = ({
  label,
  icon,
  isAvatar,
  avatarUrl,
  isActive,
  onSelect,
  onFocusItem,
}) => {
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(0);

  const handleFocus = () => {
    scale.value = withSpring(1.15, SPRING_CONFIG);
    bgOpacity.value = withTiming(1, { duration: 150 });
    onFocusItem();
  };

  const handleBlur = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
    bgOpacity.value = withTiming(0, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: isActive
      ? 'rgba(255, 255, 255, 0.25)'
      : `rgba(255, 255, 255, ${bgOpacity.value * 0.2})`,
  }));

  return (
    <Pressable
      isTVSelectable={true}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPress={onSelect}
      style={styles.navButtonContainer}
    >
      <Animated.View style={[styles.navButton, animatedStyle]}>
        {isAvatar ? (
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            <View style={styles.onlineIndicator} />
          </View>
        ) : icon ? (
          <Text style={styles.iconText}>{icon}</Text>
        ) : null}

        {label ? (
          <Text style={[styles.labelText, isActive && styles.activeLabelText]}>
            {label}
          </Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
};

export const TopNavBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const activeTab = useLauncherStore((state) => state.activeTab);
  const setActiveTab = useLauncherStore((state) => state.setActiveTab);
  const setCurrentSection = useLauncherStore((state) => state.setCurrentSection);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setCurrentTime(`${hours}:${minutesStr} ${ampm}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleFocusTopNav = () => {
    setCurrentSection('topNav');
  };

  return (
    <View style={styles.container}>
      {/* Left Section: Category Tabs */}
      <View style={styles.leftTabs}>
        <TopNavButton
          label="Games"
          isActive={activeTab === 'games'}
          onSelect={() => setActiveTab('games')}
          onFocusItem={handleFocusTopNav}
        />
        <TopNavButton
          label="Media"
          isActive={activeTab === 'media'}
          onSelect={() => setActiveTab('media')}
          onFocusItem={handleFocusTopNav}
        />
      </View>

      {/* Right Section: Utilities & Clock */}
      <View style={styles.rightActions}>
        <TopNavButton
          icon="🔍"
          onSelect={() => console.log('Search Opened')}
          onFocusItem={handleFocusTopNav}
        />
        <TopNavButton
          icon="⚙️"
          onSelect={() => console.log('Settings Opened')}
          onFocusItem={handleFocusTopNav}
        />
        <TopNavButton
          isAvatar={true}
          avatarUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
          onSelect={() => console.log('Profile Opened')}
          onFocusItem={handleFocusTopNav}
        />
        <View style={styles.clockContainer}>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingTop: 28,
    height: 80,
    zIndex: 10,
  },
  leftTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navButtonContainer: {
    borderRadius: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 44,
    minHeight: 44,
  },
  labelText: {
    color: '#A0A5B5',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeLabelText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  iconText: {
    fontSize: 18,
  },
  avatarWrapper: {
    position: 'relative',
    width: 32,
    height: 32,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#0F1015',
  },
  clockContainer: {
    paddingLeft: 12,
  },
  clockText: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
