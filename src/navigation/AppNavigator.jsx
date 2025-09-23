import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';

import LoginScreen from '../screens/LoginScreen';
import OtpVerification from '../screens/OtpVerification';
import Splash from '../screens/Splash';
import store from '../redux/store';
import CameraScreen from '../screens/CameraScreen';
import BottomNavigation from '../navigation/BottomNavigation';
import Action from '../screens/Action'
const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Provider store={store}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen name="Home" component={BottomNavigation} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
     
      </Stack.Navigator>
    </Provider>
  );
}

export default AppNavigator;
