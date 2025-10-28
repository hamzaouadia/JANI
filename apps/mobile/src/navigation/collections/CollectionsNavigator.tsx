import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppTheme } from '@/theme/ThemeProvider';
import { CollectionsListScreen } from '@/features/collections/screens/CollectionsListScreen';
import { CollectionDetailScreen } from '@/features/collections/screens/CollectionDetailScreen';
import { NewCollectionScreen } from '@/features/collections/screens/NewCollectionScreen';
import { PriceBoardScreen } from '@/features/collections/screens/PriceBoardScreen';

export type CollectionsStackParamList = {
  CollectionsList: undefined;
  CollectionDetail: { collectionId: string };
  NewCollection: undefined;
  PriceBoard: undefined;
};

const Stack = createNativeStackNavigator<CollectionsStackParamList>();

export const CollectionsNavigator = () => {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="CollectionsList"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text }
      }}
    >
      <Stack.Screen name="CollectionsList" component={CollectionsListScreen} options={{ title: 'Collections' }} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} options={{ title: 'Collection' }} />
      <Stack.Screen name="NewCollection" component={NewCollectionScreen} options={{ title: 'New Collection' }} />
      <Stack.Screen name="PriceBoard" component={PriceBoardScreen} options={{ title: 'Price Board' }} />
    </Stack.Navigator>
  );
};
