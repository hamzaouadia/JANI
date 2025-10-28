import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@/theme/ThemeProvider';
import { PlaceholderScreen } from '@/navigation/PlaceholderScreen';

const ThreadsScreen = () => <PlaceholderScreen>Co-op Threads</PlaceholderScreen>;
const ThreadScreen = () => <PlaceholderScreen>Co-op Thread</PlaceholderScreen>;

export type CAChatStackParamList = {
  CAThreads: undefined;
  CAThread: { threadId: string };
};

const Stack = createNativeStackNavigator<CAChatStackParamList>();

export const ChatNavigatorCA = () => {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="CAThreads"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text }
      }}
    >
      <Stack.Screen name="CAThreads" component={ThreadsScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="CAThread" component={ThreadScreen} options={{ title: 'Thread' }} />
    </Stack.Navigator>
  );
};
