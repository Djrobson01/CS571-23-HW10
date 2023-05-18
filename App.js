
// Keep this here!
import 'react-native-gesture-handler';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import BadgerLoginScreen from './components/BadgerLoginScreen';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import BadgerLandingScreen from './components/BadgerLandingScreen';
import BadgerChatroomScreen from './components/BadgerChatroomScreen';
import BadgerRegisterScreen from './components/BadgerRegisterScreen';
import BadgerLogoutScreen from './components/BadgerLogoutScreen';
import BadgerConversionScreen from './components/BadgerConversionScreen';

const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [anon, setAnon] = useState(false)

  useEffect(() => {
    fetch('https://cs571.org/s23/hw10/api/chatroom', {
      method: "GET",
      headers: {
        'X-CS571-ID': 'bid_14a36d6cb07d9384668f'
      }
    })
    .then(res => res.json())
    .then(data => {
      setChatrooms(data)
    })
  }, []);

  async function setKey(value) {
    await SecureStore.setItemAsync('token', value);
  }

  async function getToken() {
    let token = await SecureStore.getItemAsync('token');
    if(token) {
      return token;
    }
    else {
      console.log('No token');
    }
  }

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} anon={anon} getToken={getToken()} />}
              </ChatDrawer.Screen>
            })
          }
          {
            anon === true
            ? <ChatDrawer.Screen 
            name="Signup"
            options={{
              drawerActiveTintColor: 'green',
              drawerLabel: (info) => {
                return <View>
                  {
                    info.focused 
                    ? <Text style={{color: 'green'}}>Signup</Text>
                    : <Text style={{color: 'green'}}>Signup</Text>
                  }
                </View>
              }
            }} 
            >
              {(props) => <BadgerConversionScreen setIsLoggedIn={setIsLoggedIn} setAnon={setAnon} setIsRegistering={setIsRegistering} />}
            </ChatDrawer.Screen>
            : <ChatDrawer.Screen 
            name="Logout" 
            options={{
              drawerActiveTintColor: 'red',
              drawerLabel: (info) => {
                return <View>
                  {
                    info.focused 
                    ? <Text style={{color: 'red'}}>Logout</Text>
                    : <Text style={{color: 'red'}}>Logout</Text>
                  }
                </View>
              }
            }} 
            >{(props) => <BadgerLogoutScreen cb={setIsLoggedIn} setRegistering={setIsRegistering} setKey={setKey} />}</ChatDrawer.Screen>
          }

        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen loggedIn={setIsLoggedIn} setKey={setKey} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen setAnon={setAnon} setKey={setKey} loggedIn={setIsLoggedIn} setIsRegistering={setIsRegistering} />
  }
}


