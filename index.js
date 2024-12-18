import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  require('react-native-web');
}

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
