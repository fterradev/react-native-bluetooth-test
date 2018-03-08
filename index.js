import { AppRegistry } from 'react-native';
import App from './App';
AppRegistry.registerComponent('reactnativebluetoothtest', () => App);
if (process.env.NODE_ENV === 'development') {
  console.disableYellowBox = ['Remote debugger'];
}
