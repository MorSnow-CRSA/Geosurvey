import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);


// To generate an apk file for the app, run the following command:
// eas build -p android --profile production

// npx expo prebuild --platform android && cd android && gradlew assembleRelease && cd .. && move android\app\build\outputs\apk\release\app-release.apk my-app-release.apk 