import React from 'react';
import { Provider } from 'react-redux';

import store from './src/store';
export const wrapRootElement = ({ element }: { element: JSX.Element }) => {
  return <Provider store={store}>{element}</Provider>;
};

export const onRenderBody = ({ setHtmlAttributes }: { setHtmlAttributes: (lang: { lang: string }) => void }) => {
  setHtmlAttributes({ lang: 'en' });
};
