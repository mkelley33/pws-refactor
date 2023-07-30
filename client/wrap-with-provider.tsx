import { Provider } from 'react-redux';

import store from './src/store';

const wrapWithProvider = ({ element }: { element: JSX.Element }) => <Provider store={store}>{element}</Provider>;
export default wrapWithProvider;
