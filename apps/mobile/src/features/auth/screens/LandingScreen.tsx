import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { AuthStackParamList } from '@/navigation/types';

const { width } = Dimensions.get('window');

const PAGES = [
  {
    title: 'Meet JANI',
    subtitle: 'Your farm management companion.',
    description:
      'Track every step from seed to harvest. Manage plots, record events, and ensure quality—all from your mobile device.',
    emoji: '🌱'
  },
  {
    title: 'Track Everything',
    subtitle: 'From planting to harvest.',
    description:
      'Record planting, irrigation, fertilizing, and harvests. Take photos, scan barcodes, and maintain complete records.',
    emoji: '📋'
  },
  {
    title: 'Work Offline',
    subtitle: 'No internet? No problem.',
    description: 'Capture events even without connectivity. Your data syncs automatically when you\'re back online.',
    emoji: '📡'
  }
] as const;

type Props = NativeStackScreenProps<AuthStackParamList, 'Landing'>;

export const LandingScreen = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView | null>(null);
  const [index, setIndex] = useState(0);

  const reanimatedOnScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  // Keep React state index in sync with scroll position for CTA label
  useAnimatedReaction(
    () => Math.round(scrollX.value / width),
    (i, prev) => {
      if (i !== prev) {
        runOnJS(setIndex)(i);
      }
    }
  );

  const handleContinue = () => {
    if (index < PAGES.length - 1) {
      const next = index + 1;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      navigation.navigate('Signup');
    }
  };

  return (
    <Screen padded={false}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={reanimatedOnScroll}
        scrollEventThrottle={16}
        onScrollEndDrag={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const maxX = (PAGES.length - 1) * width;
          const vx = e.nativeEvent.velocity?.x ?? 0;
          const x = e.nativeEvent.contentOffset.x;
          // If user is on or beyond the last page and tries to swipe forward (vx>0) or drags past boundary, navigate
          if (x >= maxX - 2 && (vx > 0.01 || x > maxX + 8)) {
            requestAnimationFrame(() => navigation.replace('Signup'));
          }
        }}
      >
        {PAGES.map((p) => (
          <LinearGradient
            key={p.title}
            colors={[theme.colors.primary + '15', theme.colors.background]}
            style={[styles.page, { width }]}
          >
            <Animated.View style={styles.heroContent}> 
              <View style={[styles.badge, { backgroundColor: theme.colors.primaryMuted, borderColor: `${theme.colors.primary}33` }]}>
                <Text style={[styles.badgeText, { color: theme.colors.primary }]}>Farm Smart</Text>
              </View>
              <Text style={[theme.typography.heading, styles.title, { color: theme.colors.text }]}>{p.title}</Text>
              <Text style={[theme.typography.subheading, styles.heroSubtitle, { color: theme.colors.primary }]}>
                {p.subtitle}
              </Text>
              <Text style={[theme.typography.body, styles.heroDescription, { color: theme.colors.textMuted }]}>
                {p.description}
              </Text>

              <View style={[styles.illustrationWrap, { paddingHorizontal: theme.spacing(5) }]}> 
                <View style={[styles.illustrationCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
                  <Text style={{ fontSize: 48 }}>{p.emoji}</Text>
                  <Image
                    source={require('../../../../assets/splash-icon.png')}
                    resizeMode="contain"
                    style={styles.illustration}
                    accessibilityIgnoresInvertColors
                    accessible
                    accessibilityLabel="App illustration"
                  />
                </View>
              </View>

              {/* CTA moved to sticky footer controlled by current index */}
            </Animated.View>
          </LinearGradient>
        ))}
      </Animated.ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.ctaBar, { paddingHorizontal: theme.spacing(5), backgroundColor: 'transparent' }]}> 
        <Button fullWidth onPress={handleContinue}>
          {index < PAGES.length - 1 ? 'Continue' : 'Get started'}
        </Button>
        {index === PAGES.length - 1 ? (
          <Button
            variant="secondary"
            fullWidth
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: theme.spacing(2) }}
          >
            I already have an account
          </Button>
        ) : null}
      </View>

      {/* Progress Dots */}
      <View style={styles.dotsWrap}>
        {PAGES.map((_, i) => (
          <Dot key={i} i={i} scrollX={scrollX} />
        ))}
      </View>
    </Screen>
  );
};

const Dot = ({ i, scrollX }: { i: number; scrollX: SharedValue<number> }) => {
  const style = useAnimatedStyle(() => {
    const position = scrollX.value / width;
    const active = Math.max(0, 1 - Math.abs(position - i));
    return {
      transform: [{ scale: withTiming(1 + active * 0.4, { duration: 180 }) }],
      opacity: interpolate(active, [0, 1], [0.4, 1])
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center'
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16
  },
  badgeText: {
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  title: {
    fontSize: 42,
    lineHeight: 46,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700'
  },
  heroSubtitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600'
  },
  heroDescription: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%'
  },
  illustrationCard: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A342720',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2
  },
  illustration: {
    width: '50%',
    height: '50%'
  },
  ctaBar: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0
  },
  dotsWrap: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9AA4B2'
  }
});
