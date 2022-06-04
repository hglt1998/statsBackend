import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

const Stack = createStackNavigator();

import actuaciones from './Screens/procesiones'
import createActuacion from "./Screens/createActuacion";
import actuacionDetail from "./Screens/actuacionDetail"
import createComposicion from './Screens/createComposicion';
import createCompositor from './Screens/createCompositor';

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="procesiones" component={actuaciones} options={{title: 'Actuaciones'}}/>
            <Stack.Screen name="actuacionDetail" component={actuacionDetail} options={{title: 'Actuación'}}/>
            <Stack.Screen name="createActuacion" component={createActuacion} options={{title: 'Nueva Actuación'}}/>
            <Stack.Screen name="createComposicion" component={createComposicion} options={{title: 'Crear composición'}}/>
            <Stack.Screen name="createCompositor" component={createCompositor} options={{title: 'Crear compositor'}}/>
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
