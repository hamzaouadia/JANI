import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@/theme/ThemeProvider';
import { PlaceholderScreen } from '@/navigation/PlaceholderScreen';

const ThreadsScreen = () => <PlaceholderScreen>Exporter Threads</PlaceholderScreen>;
const ThreadScreen = () => <PlaceholderScreen>Exporter Thread</PlaceholderScreen>;

export type EXPChatStackParamList = {
  EXPThreads: undefined;
  EXPThread: { threadId: string };
};

const Stack = createNativeStackNavigator<EXPChatStackParamList>();

export const ChatNavigatorEXP = () => {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="EXPThreads"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text }
      }}
    >
      <Stack.Screen name="EXPThreads" component={ThreadsScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="EXPThread" component={ThreadScreen} options={{ title: 'Thread' }} />
    </Stack.Navigator>
  );
};
