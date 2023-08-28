import { Provider } from 'react-redux';

import { ThemeProvider } from '@components/theme-context';
import store from './src/store';

const wrapWithProvider = ({ element }: { element: JSX.Element }) => (
  <Provider store={store}>
    <ThemeProvider>{element}</ThemeProvider>
  </Provider>
);
export default wrapWithProvider;
