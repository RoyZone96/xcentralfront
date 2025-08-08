import { render } from '@testing-library/react';
import App from './App';

test('renders XCentral app without crashing', () => {
  render(<App />);
  // Test passes if render doesn't throw an error
  expect(true).toBe(true);
});
