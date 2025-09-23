import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppContainer from './src/base/AppContainer';  

const App = () => {
  return (
    <NavigationContainer>
      <AppContainer />
    </NavigationContainer>
  );
};

export default App;
