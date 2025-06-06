import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

import actuaciones from "./Screens/procesiones";
import createActuacion from "./Screens/createActuacion";
import actuacionDetail from "./Screens/actuacionDetail";
import createComposicion from "./Screens/createComposicion";
import createCompositor from "./Screens/createCompositor";
import manageOrganizadores from "./Screens/manageOrganizadores";
import { Provider } from "react-native-paper";

function MyStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="procesiones" component={actuaciones} options={{ title: "BMM STATS" }} />
			<Stack.Screen
				name="actuacionDetail"
				component={actuacionDetail}
				options={{ title: "Actuación", headerBackTitle: "back", detachPreviousScreen: true, headerShown: false, gestureDirection: "horizontal" }}
			/>
			<Stack.Screen name="createActuacion" component={createActuacion} options={{ title: "Nueva Actuación", headerBackTitle: "back" }} />
			<Stack.Screen name="createComposicion" component={createComposicion} options={{ title: "Crear composición" }} />
			<Stack.Screen name="createCompositor" component={createCompositor} options={{ title: "Crear compositor" }} />
			<Stack.Screen name="manageOrganizadores" component={manageOrganizadores} options={{ title: "Organizadores" }} />
		</Stack.Navigator>
	);
}

export default function App() {
	return (
		<NavigationContainer>
			<Provider>
				<MyStack />
			</Provider>
		</NavigationContainer>
	);
}
