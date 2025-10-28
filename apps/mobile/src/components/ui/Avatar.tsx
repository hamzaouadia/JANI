import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/ThemeProvider';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: ImageSourcePropType | string;
  name?: string;
  size?: AvatarSize;
  badge?: React.ReactNode;
  online?: boolean;
  variant?: 'circle' | 'rounded' | 'square';
}

const sizeConfig = {
  xs: { size: 24, fontSize: 10 },
  sm: { size: 32, fontSize: 12 },
  md: { size: 40, fontSize: 14 },
  lg: { size: 56, fontSize: 18 },
  xl: { size: 80, fontSize: 28 },
} as const satisfies Record<AvatarSize, { size: number; fontSize: number }>;

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  badge,
  online,
  variant = 'circle',
}) => {
  const theme = useAppTheme();
  const config = sizeConfig[size];
  
  const initials = React.useMemo(() => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, [name]);

  const borderRadiusMap = {
    circle: config.size / 2,
    rounded: 12,
    square: 4,
  };

  const containerStyle = {
    width: config.size,
    height: config.size,
    borderRadius: borderRadiusMap[variant],
  };

  const renderContent = () => {
    if (source) {
      const imageSource = typeof source === 'string' ? { uri: source } : source;
      return (
        <Image
          source={imageSource}
          style={[containerStyle, styles.image]}
          resizeMode="cover"
        />
      );
    }

    // Gradient background for initials
    return (
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[containerStyle, styles.gradient]}
      >
        <Text style={[styles.initials, { fontSize: config.fontSize }]}>
          {initials}
        </Text>
      </LinearGradient>
    );
  };

  return (
    <View style={containerStyle}>
      {renderContent()}
      
      {/* Online Badge */}
      {online && (
        <View
          style={[
            styles.onlineBadge,
            {
              width: config.size * 0.25,
              height: config.size * 0.25,
              borderRadius: config.size * 0.125,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}

      {/* Custom Badge */}
      {badge && (
        <View style={[styles.customBadge, { bottom: -4, right: -4 }]}>
          {badge}
        </View>
      )}
    </View>
  );
};

interface AvatarGroupProps {
  avatars: Array<{ source?: ImageSourcePropType | string; name?: string }>;
  size?: AvatarSize;
  max?: number;
  spacing?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  max = 3,
  spacing = -8,
}) => {
  const theme = useAppTheme();
  const config = sizeConfig[size];
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <View style={styles.group}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupAvatar,
            {
              marginLeft: index > 0 ? spacing : 0,
              zIndex: displayAvatars.length - index,
            },
          ]}
        >
          <Avatar {...avatar} size={size} />
        </View>
      ))}
      
      {remaining > 0 && (
        <View
          style={[
            styles.groupAvatar,
            { marginLeft: spacing, zIndex: 0 },
          ]}
        >
          <View
            style={[
              {
                width: config.size,
                height: config.size,
                borderRadius: config.size / 2,
                backgroundColor: theme.colors.border,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Text
              style={[
                styles.remainingText,
                { fontSize: config.fontSize, color: theme.colors.text },
              ]}
            >
              +{remaining}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  onlineBadge: {
    position: 'absolute',
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  customBadge: {
    position: 'absolute',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 100,
  },
  remainingText: {
    fontWeight: '600',
  },
});
