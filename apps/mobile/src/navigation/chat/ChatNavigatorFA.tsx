import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@/theme/ThemeProvider';
import { PlaceholderScreen } from '@/navigation/PlaceholderScreen';

const ThreadsScreen = () => <PlaceholderScreen>Field Agent Threads</PlaceholderScreen>;
const ThreadScreen = () => <PlaceholderScreen>Field Agent Thread</PlaceholderScreen>;

export type FAChatStackParamList = {
  FAThreads: undefined;
  FAThread: { threadId: string };
};

const Stack = createNativeStackNavigator<FAChatStackParamList>();

export const ChatNavigatorFA = () => {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="FAThreads"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text }
      }}
    >
      <Stack.Screen name="FAThreads" component={ThreadsScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="FAThread" component={ThreadScreen} options={{ title: 'Thread' }} />
    </Stack.Navigator>
  );
};
