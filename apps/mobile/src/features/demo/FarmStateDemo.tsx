import { ScrollView, Text, View, StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { FarmStateTracker } from '@/components/farm/FarmStateTracker';
import { useFarmState } from '@/hooks/useFarmState';
import { useAppTheme } from '@/theme/ThemeProvider';

export const FarmStateDemo = () => {
  const theme = useAppTheme();
  const farmProgress = useFarmState();

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Farm State Tracker Demo
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Compare horizontal vs vertical layouts
          </Text>
        </View>

        {/* Horizontal Compact */}
        <View style={styles.section}>
          <Text style={[theme.typography.subheading, { color: theme.colors.text, marginBottom: 12 }]}>
            Horizontal Compact
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 16 }]}>
            Great for event screens and limited space
          </Text>
          <FarmStateTracker
            currentState={farmProgress.state}
            progress={farmProgress.progress}
            nextAction={farmProgress.nextAction}
            daysInState={farmProgress.daysInState}
            compact={true}
            vertical={false}
          />
        </View>

        {/* Horizontal Full */}
        <View style={styles.section}>
          <Text style={[theme.typography.subheading, { color: theme.colors.text, marginBottom: 12 }]}>
            Horizontal Full
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 16 }]}>
            Includes header and progress bar
          </Text>
          <FarmStateTracker
            currentState={farmProgress.state}
            progress={farmProgress.progress}
            nextAction={farmProgress.nextAction}
            daysInState={farmProgress.daysInState}
            compact={false}
            vertical={false}
          />
        </View>

        {/* Vertical Full */}
        <View style={styles.section}>
          <Text style={[theme.typography.subheading, { color: theme.colors.text, marginBottom: 12 }]}>
            Vertical Layout
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 16 }]}>
            Detailed view with descriptions and action items
          </Text>
          <FarmStateTracker
            currentState={farmProgress.state}
            progress={farmProgress.progress}
            nextAction={farmProgress.nextAction}
            daysInState={farmProgress.daysInState}
            compact={false}
            vertical={true}
            onStatePress={(state) => {
              console.log('Pressed state:', state);
            }}
          />
        </View>

        {/* Vertical Compact */}
        <View style={styles.section}>
          <Text style={[theme.typography.subheading, { color: theme.colors.text, marginBottom: 12 }]}>
            Vertical Compact
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 16 }]}>
            Streamlined vertical view without descriptions
          </Text>
          <FarmStateTracker
            currentState={farmProgress.state}
            progress={farmProgress.progress}
            nextAction={farmProgress.nextAction}
            daysInState={farmProgress.daysInState}
            compact={true}
            vertical={true}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
});