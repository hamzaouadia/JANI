/// <reference types="jest" />
import { renderWithProviders } from '@/utils/test-utils';
import { HomeScreen } from './HomeScreen';

describe('HomeScreen', () => {
  it('renders supplier list', async () => {
    const screen = renderWithProviders(<HomeScreen />);

    expect(screen.getByText(/Discover trusted suppliers/i)).toBeTruthy();
    expect(await screen.findByText(/Andes Coffee Cooperative/)).toBeTruthy();
  });
});
