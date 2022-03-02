import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

const Stack = createStackNavigator();

import UsersList from './Screens/usersLists'
import createUser from './Screens/createUser'
import userDetail from './Screens/userDetail'
import actuaciones from './Screens/procesiones'
import createActuacion from "./Screens/createActuacion";
import actuacionDetail from "./Screens/actuacionDetail"
import createComposicion from './Screens/createComposicion';

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="procesiones" component={actuaciones} options={{title: 'Actuaciones'}}/>
            <Stack.Screen name="actuacionDetail" component={actuacionDetail} options={{title: 'Actuación'}}/>
            <Stack.Screen name="createActuacion" component={createActuacion} options={{title: 'Nueva Actuación'}}/>
            <Stack.Screen name="createComposicion" component={createComposicion} options={{title: 'Crear composición'}}/>
            <Stack.Screen name="createUser" component={createUser} options={{title: 'User creation'}}/>
            <Stack.Screen name="userDetail" component={userDetail} options={{title: 'User detail'}}/>
        </Stack.Navigator>
    )
}

export default function App() {
    return (
        <NavigationContainer>
            <MyStack/>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
