/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import 'react-native-gesture-handler';
import RootRoute from './src/navigations/RootRoute';

const App: () => Node = () => {
  return <RootRoute />;
};

export default App;
