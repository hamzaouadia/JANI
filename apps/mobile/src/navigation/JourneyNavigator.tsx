import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { JourneyStackParamList } from '@/navigation/types';

import { JourneyScreen } from '@/features/dashboard/screens/JourneyScreen';
import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { OrdersScreen } from '@/features/orders/screens/OrdersScreen';
import { CaptureScreen } from '@/features/capture/screens/CaptureScreen';
import { UIComponentsScreen } from '@/features/demo/screens/UIComponentsScreen';

const Stack = createNativeStackNavigator<JourneyStackParamList>();

export const JourneyNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="JourneyHome">
    <Stack.Screen name="JourneyHome" component={JourneyScreen} />
    <Stack.Screen name="Capture" component={CaptureScreen} />
    <Stack.Screen name="UIComponents" component={UIComponentsScreen} />
    <Stack.Screen name="FieldOps" component={HomeScreen} />
    <Stack.Screen name="HarvestOrders" component={OrdersScreen} />
    <Stack.Screen name="FarmDashboard" component={DashboardScreen} />
    <Stack.Screen name="TeamPlanner" component={HomeScreen} />
    <Stack.Screen name="FarmOrders" component={OrdersScreen} />
    <Stack.Screen name="ExportPipeline" component={DashboardScreen} />
    <Stack.Screen name="Compliance" component={HomeScreen} />
    <Stack.Screen name="ExportOrders" component={OrdersScreen} />
    <Stack.Screen name="BuyerOverview" component={DashboardScreen} />
    <Stack.Screen name="SupplierNetwork" component={HomeScreen} />
    <Stack.Screen name="BuyerOrders" component={OrdersScreen} />
    <Stack.Screen name="FleetBoard" component={DashboardScreen} />
    <Stack.Screen name="ColdChain" component={HomeScreen} />
    <Stack.Screen name="LogisticsLoads" component={OrdersScreen} />
  </Stack.Navigator>
);
