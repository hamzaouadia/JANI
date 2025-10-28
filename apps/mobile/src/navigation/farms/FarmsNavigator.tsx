import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@/theme/ThemeProvider';
import { FarmListScreen } from '@/features/farms/screens/FarmListScreen';
import { FarmDetailScreen } from '@/features/farms/screens/FarmDetailScreen';
import { FarmStatesScreen } from '@/features/farms/screens/FarmStatesScreen';
import { FarmStateDetailScreen } from '@/features/farms/screens/FarmStateDetailScreen';
import type { FarmState } from '@/constants/farmStates';

export type FarmStackParamList = {
  FarmList: undefined;
  FarmDetail: { id: string };
  FarmStates: undefined;
  FarmStateDetail: { state: FarmState };
};

const Stack = createNativeStackNavigator<FarmStackParamList>();

export const FarmsNavigator = (): JSX.Element => {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="FarmList"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text }
      }}
    >
      <Stack.Screen name="FarmList" component={FarmListScreen} options={{ title: 'Farms' }} />
      <Stack.Screen name="FarmDetail" component={FarmDetailScreen} options={{ title: 'Farm' }} />
      <Stack.Screen name="FarmStates" component={FarmStatesScreen} options={{ title: 'Farm Progress' }} />
      <Stack.Screen name="FarmStateDetail" component={FarmStateDetailScreen} options={{ title: 'State Details' }} />
    </Stack.Navigator>
  );
};
