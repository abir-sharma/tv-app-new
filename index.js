import { registerRootComponent } from 'expo';
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://0bf0a11f33a04e9eb156f83b04394bc3@glitchtip.betterpw.live/1",
});

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
