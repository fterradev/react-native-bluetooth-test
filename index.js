import { AppRegistry } from 'react-native';
import App from './App';
AppRegistry.registerComponent('reactnativebluetoothtest', () => App);
if (process.env.NODE_ENV === 'development') {
  //console.disableYellowBox = true;
  console.ignoredYellowBox = ['Debugger and device times'];
}
