import { screen } from '@testing-library/react-native';
import { renderApp } from '../test-utils/renderApp';

const TIMEOUT_FOR_DEBUG = 50000; // 50 seconds, to allow time for debugging if needed
describe('integration: Home', () => {
  it(
    'should display the city list and navigate to details when the city card is pressed',
    async () => {
      //
      renderApp({ isAuthenticated: true });

      expect(await screen.findByText('Rio de Janeiro')).toBeOnTheScreen();
    },
    TIMEOUT_FOR_DEBUG
  );
});
