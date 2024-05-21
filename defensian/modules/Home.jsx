import React, { Component, useEffect, useRef, forwardRef } from 'react';
import { Avatar, Button, Card, Drawer, IconButton, Icon, Text, TextInput, BottomNavigation, Divider } from 'react-native-paper';
import { TouchableWithoutFeedback as RNTouchableWithoutFeedback } from 'react-native';


import useState from 'react-usestateref';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

const Home =({navigation, route})=> {


// Notification StyleSheets ---------------------------------------
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        //backgroundColor: '#7c7d7d',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
  });
  // End of Notification StyleSheets --------------------------------

return <View style={styles.container}>
    <Text>
        test0
    </Text>
</View>
}

export default Home;