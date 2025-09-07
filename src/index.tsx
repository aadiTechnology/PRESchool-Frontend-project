import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { Capacitor } from '@capacitor/core';
import { IonApp } from '@ionic/react';
import { initMobile } from './mobile';

const isNative = Capacitor.isNativePlatform();

if (isNative) {
  initMobile();
}

const Root = () => (
  <React.StrictMode>
    <CustomThemeProvider>
      {isNative ? (
        <IonApp>
          <App />
        </IonApp>
      ) : (
        <App />
      )}
    </CustomThemeProvider>
  </React.StrictMode>
);

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

