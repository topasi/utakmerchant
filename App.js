/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, Platform, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  server: Platform.select({
    ios: '127.0.0.1',
    android: '10.0.2.2',
  }),
};

const {height, width} = Dimensions.get('window');

const App = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const getFcmToken = async () => {
    try {
      let token = await AsyncStorage.getItem('fcmToken');
      if (!token) {
        const newToken = await messaging().getToken();
        if (newToken) {
          await AsyncStorage.setItem('fcmToken', newToken);
          setFcmToken(newToken);
        }
      } else {
        setFcmToken(token);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const onMessage = async e => {
    const uid = await AsyncStorage.getItem('uid');
    const token = await AsyncStorage.getItem('fcmToken');
    if (!uid) {
      await AsyncStorage.setItem('uid', e.nativeEvent.data);
      database().ref(`/${e.nativeEvent.data}/users/${token}`).update({
        OS: Platform.OS,
        versionApp: Platform.Version,
        height,
        width,
      });
    }
  };
  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken();
      }
    };
    requestUserPermission();
  }, []);
  useEffect(() => {
    // opened app
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('opened app', remoteMessage.notification);
    });
    // quit state
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log('quit state', remoteMessage.notification);
        }
      });
    // foreground state
    messaging().onMessage(async remoteMessage => {
      console.log('foreground state', remoteMessage.notification);
    });
    // background state
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('background state', remoteMessage.notification);
    });
  }, [fcmToken]);
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
        onMessage={onMessage}
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
