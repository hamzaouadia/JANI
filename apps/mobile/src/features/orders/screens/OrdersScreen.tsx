import { Text } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';

export const OrdersScreen = () => {
  const theme = useAppTheme();

  return (
    <Screen>
      <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Orders</Text>
      <Text style={[theme.typography.body, { marginTop: theme.spacing(3), color: theme.colors.textMuted }]}>
        Track incoming purchase orders, monitor fulfillment statuses, and manage supplier communications here.
      </Text>
    </Screen>
  );
};
