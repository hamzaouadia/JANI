import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@/theme/ThemeProvider';
import { PlaceholderScreen } from '@/navigation/PlaceholderScreen';

const ThreadsScreen = () => <PlaceholderScreen>Team Threads</PlaceholderScreen>;
const ThreadScreen = () => <PlaceholderScreen>Team Thread</PlaceholderScreen>;

export type FMTeamChatStackParamList = {
  FMThreads: undefined;
  FMThread: { threadId: string };
};

const Stack = createNativeStackNavigator<FMTeamChatStackParamList>();

export const TeamChatNavigatorFM = () => {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="FMThreads"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text }
      }}
    >
      <Stack.Screen name="FMThreads" component={ThreadsScreen} options={{ title: 'Team & Chat' }} />
      <Stack.Screen name="FMThread" component={ThreadScreen} options={{ title: 'Thread' }} />
    </Stack.Navigator>
  );
};
