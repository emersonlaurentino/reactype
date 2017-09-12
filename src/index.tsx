import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Application from './application'

declare const module: any;

const rootEl = document.querySelector('#app');

const render = (Component) => ReactDOM.render(
  <AppContainer>
    <Component />
  </AppContainer>,
  rootEl,
);

render(Application);

if (module.hot) module.hot.accept('./application', () => render(Application))
