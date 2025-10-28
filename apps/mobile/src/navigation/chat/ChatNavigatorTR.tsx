import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@/theme/ThemeProvider';
import { PlaceholderScreen } from '@/navigation/PlaceholderScreen';

const ThreadsScreen = () => <PlaceholderScreen>Transporter Threads</PlaceholderScreen>;
const ThreadScreen = () => <PlaceholderScreen>Transporter Thread</PlaceholderScreen>;

export type TRChatStackParamList = {
  TRThreads: undefined;
  TRThread: { threadId: string };
};

const Stack = createNativeStackNavigator<TRChatStackParamList>();

export const ChatNavigatorTR = () => {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="TRThreads"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text }
      }}
    >
      <Stack.Screen name="TRThreads" component={ThreadsScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="TRThread" component={ThreadScreen} options={{ title: 'Thread' }} />
    </Stack.Navigator>
  );
};
