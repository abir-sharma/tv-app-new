import Providers from './utils/Providers';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home'
import Details from './screens/Details'

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <Providers>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Details" component={Details}/>
      </Stack.Navigator>
    </NavigationContainer>
    </Providers>
  );
}
