import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '@/navigation/types';

import { LandingScreen } from '@/features/auth/screens/LandingScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { SignupScreen } from '@/features/auth/screens/SignupScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="Landing"
    screenOptions={{
      headerShown: false,
      animation: 'fade_from_bottom'
    }}
  >
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);
