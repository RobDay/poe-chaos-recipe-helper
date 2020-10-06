import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ViewManager from './components/view-manager'
import * as serviceWorker from './serviceWorker';
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import { HashRouter, Route } from "react-router-dom"

const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

// 1. Create a client engine instance
const engine = new Styletron();

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
    <StyletronProvider value={engine} debug={debug} debugAfterHydration>
      <Route>
        <ViewManager />
      </Route>
    </StyletronProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
