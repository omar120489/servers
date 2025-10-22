import { createRoot } from 'react-dom/client';

// third party
import { Provider } from 'react-redux';

// project imports
import App from 'App';
import { store } from 'store';
import * as serviceWorker from 'serviceWorker';
import reportWebVitals from 'reportWebVitals';
import { ConfigProvider } from 'contexts/ConfigContext';
import { validateEnvironmentVariables } from './config/validateEnv';

// style + assets
import 'assets/scss/style.scss';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// google-fonts
// Preload critical fonts (for example, Roboto) to reduce FOUC.
// (In a real app, you might add a <link rel="preload" as="font" href="..." crossorigin="anonymous" /> tag in your HTML (or via a plugin) for each critical font.)
// (Below is a dummy example – replace with your actual font URLs if needed.)
// <link rel="preload" as="font" href="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2" crossorigin="anonymous" />
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// ==============================|| ENV VALIDATION ||============================== //

validateEnvironmentVariables();

// ==============================|| REACT DOM RENDER ||============================== //

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
