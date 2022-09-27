/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, Platform} from 'react-native';
import {WebView} from 'react-native-webview';

const config = {
  server: Platform.select({
    ios: '127.0.0.1',
    android: '10.0.2.2',
  }),
};

const App = () => {
  const runBeforeFirst = `
    window.isNativeApp = true;
  `;
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        scalesPageToFit={true}
        useWebKit={true}
        startInLoadingState={true}
        injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
        source={{
          uri: __DEV__
            ? `http://${config.server}:3000/login`
            : 'https://utak.io/login',
        }}
      />
    </SafeAreaView>
  );
};

export default App;
