import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';

export const IncentivesScreen = () => {
  return (
    <Screen>
      <EmptyState
        icon="trophy"
        title="Incentives"
        description="Track your progress and earnings here. Coming soon."
      />
    </Screen>
  );
};
