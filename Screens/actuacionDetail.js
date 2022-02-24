import React from 'react'
import {Button, ScrollView, Text, View} from "react-native";

const actuacionDetail = (props) => {

    const handleHome = async () => {
        await props.navigation.navigate('procesiones')
    }
    return (
        <ScrollView>
            <View>
                <Text>{props.route.params.id}</Text>
            </View>
            <Button title={'Home'} onPress={handleHome}/>
        </ScrollView>
    )

}

export default actuacionDetail