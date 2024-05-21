import React, { useEffect, useRef } from 'react';
import { Platform, Dimensions, ImageBackground, SafeAreaView } from 'react-native';
import { useCallback } from 'react';
import useState from 'react-usestateref';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Snackbar, Portal, Card, Modal, Button } from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';

// Needs to be at top of root!!!! (App.js or Index.js)
import 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { io } from "socket.io-client";

import Login from './screens/Login.jsx';
import MainScreen from './screens/MainScreen.jsx';
import Splash from './screens/Splash.jsx';

import * as globalState from "./globalState.jsx"

import * as Font from 'expo-font';

import { useAtom } from 'jotai'

import { MenuProvider } from 'react-native-popup-menu';

// Local Storage
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV();

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

const darkTheme = {
  ...DefaultTheme,
  mode: 'adaptive',
  dark: true,
  // Customize other properties of the dark theme as needed
};

const styles = StyleSheet.create({
  popupStyle: {
    display: 'flex',
    width: '30%',
    justifyContent: 'center',
    margin: 'auto',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
  flexShrink: 0,
  },
});

export default function App(){

  return (<MenuProvider><AppContent/></MenuProvider>)
}

export function AppContent() {
 
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [socketState, setSocketState] = useAtom(globalState.socketState)
  const [UserMap, setUserMap] = useAtom(globalState.userMapState)
  const [UserObj, setUserObj] = useAtom(globalState.userObjState)
  const [screenID,setScreenID] = useAtom(globalState.screenID)
  const mainState = useState(Object);
  const [,setState, stateRef] = mainState;
  if(socketState.size > 0) var socketIO = socketState.get('socketIO')
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  // Snackbar visibility
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [windowDimensions, setWindowDimensions] = useAtom(globalState.windowSize);

  const [isMobile, setIsMobile] = useState(false)

  var socket = io(`http://localhost:19007/`);

  // Resize the app on screen change ----------------
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(Dimensions.get('window'));
    };

    Dimensions.addEventListener('change', handleResize);

    return () => {
      Dimensions.removeEventListener('change', handleResize);
    };
  }, []);
  // ------------------------------------------------

 // Determine If User Is On Mobile Device -----------
 useEffect(()=>{
  if (Platform.OS === 'ios') {
    setIsMobile(true)
  } else if (Platform.OS === 'android') {
    setIsMobile(true)
  } else if (Platform.OS === 'web') {
    setIsMobile(false)
  } else {
    setIsMobile(false)
  }
 },[])
 // ------------------------------------------------

  useEffect(()=>{ // connect to socketIO
    if(!socketState.has('socketIO') || !socketState.get('socketIO'?.connected)) // check if value is inside of globalstate
    {
      socketState.set("socketIO",socket) // set value to globalstate
    }
  },[socketState.get('socketIO')?.connected])

  socketIO?.on('connect', ()=>{
    console.log("Connection Established")
    socketState.set("socketIO",socket) // set value to globalstate
  })

  socketIO?.on('disconnect', () => {
    console.log('Disconnected from server');
    console.log(socketState)
  });

  const fetchFonts = () => {
    return Font.loadAsync({
      'Kanit-Light': require('./assets/fonts/Kanit-Light.ttf'),
    });
  };

  const checkConnection=()=>{
    if(!socketState.has('socketIO') || !socketState.get('socketIO'?.connected)) // check if value is inside of globalstate
    {
    return true;
    }
    else
    {
    return false;
    }
}

  // Local Storage Functions
  
  // UserMap
  async function LS_UserMap(obj) {
    try {
      if(obj) storage.set('UserMap', JSON.stringify(obj)); 
      else storage.set('UserMap', JSON.stringify(Object.fromEntries([...UserMap])));
    } catch (e) {
      console.log("Error Code: 1 (Storing UserMap)", e)
    }
  };

  // Remove user map from Local Storage
  async function Remove_LC_UserMap() {
    try {
      storage.delete('UserMap');
     // setUserMap(new Map())
    } catch (e) {
      console.log("Error while getting usermap:", e)
    }
  };

  // Get User Map
  async function Get_LC_UserMap() {
    var test = storage.getString('UserMap')
    //setDynamicUserMap(JSON.parse(test))
  };

  // Begininng of CRUD Functions ---------------------------------
  const create = ({database, document, collection, action, data},callBK) => {
    if(checkConnection)
    {
      socketIO.emit(action, {database, collection, document, data, callBK},callBK)
    }
  }

  const read = ({database, collection, document, _id, query, action, filter},callBK) => {
    if(checkConnection)
    {
      if(document) 
      {
        console.log("Code is using document key to find a collection!")
        collection = document
      }
      socketIO.emit(action ? action : "queryDB", {database, collection, _id, query, filter},callBK)
    }
  }

  const update = ({database, collection, query, data, arrayFilter, returnVal},callBK) => {
    if(checkConnection)
    {
      socketIO.emit("update", {database, collection, query, data, arrayFilter, returnVal},callBK)
    }
  }

  const deleteVal = ({database, collection, document, query, field, action, type},callBK) => { // action represents deleting entire document or just a key-value pair
    if(document) 
    {
      console.log("Code is using document key to find a collection!")
      collection = document
    }

    if(!database) 
    {
      callBK({success: false, info: "No database provided when performing delete!"})
      return console.error("No database provided when performing delete")
    }
    if(checkConnection)
    {
      // Security Check
      query.secretToken = {'secretToken': UserMap.get('secretToken')}

      socketIO.emit("delete", {database, collection, validation: {collection: UserMap.get('company'), secretToken: UserMap.get('secretToken')}, query, field, action, type},callBK)
    }
  }

  // End of CRUD Functions ----------------------------------------

  // Snackbar functions --------------------------------------------

  const onDismissSnackBar = () => {
    setState(p=>({...p,...{snackbarVisible: false}}))
  }

  useEffect(()=>{
    setState(p=>({...p,...{
      snackbar: <Portal><Snackbar visible={stateRef.current?.snackbarVisible} onDismiss={onDismissSnackBar} 
      action ={{label: 'Dismiss', onPress: onDismissSnackBar, textColor: 'white'}} 
      elevation={5} style={{backgroundColor: stateRef.current?.snackbarType && stateRef.current?.snackbarType === 'error' ? 
      '#de2c2c' : stateRef.current?.snackbarType === "success" ? 
      '#19a625' : stateRef.current?.snackbarType === "info" && '#32b7d1'}}>
       {stateRef.current?.snackbarContent}
        </Snackbar>
        </Portal>
    }}))
  },[stateRef.current?.snackbarVisible])

  useEffect(()=>{
    setState(p=>({...p,...{
      popup: <Modal dismissable={stateRef.current?.popupClose === false ? false : true}
      dismissableBackButton={stateRef.current?.popupClose ? true : false}
      style={stateRef.current?.popupStyle ? stateRef.current?.popupStyle : styles.popupStyle}
      onDismiss={()=>{setState(p=>({...p,popupVisible: false, popupTitle: undefined, popupDescription: undefined, popupSubmit: undefined, popupClose: undefined, popupStyle: undefined, popupInputField: undefined})); if(stateRef?.current?.popupClose) {stateRef?.current?.popupclose; console.log("Run")}}}
      overlayAccessibilityLabel="Close Popup"
      onRequestClose={() => {console.log("Closed!")}}
      visible={stateRef.current?.popupVisible}
      >
        <Card style={{backgroundColor: '#424242'}}>
          <Card.Title titleVariant="headlineSmall" titleStyle={{color: 'rgba(242, 242, 242,0.9)'}} title={stateRef.current?.popupTitle}/>
          {stateRef.current.popupDescription && <Card.Content><Text style={{color: 'rgba(242, 242, 242,0.9)'}}>{stateRef.current?.popupDescription}</Text></Card.Content>}
          {stateRef.current?.popupInputField && stateRef.current?.popupInputField}
          <Card.Content>
              <View style={{display: 'flex', flex: 1, flexDirection: 'row-reverse', gap: '2%'}}>
              {stateRef.current.popupSubmit && <Button buttonColor='#11bded' onPress={stateRef.current?.popupSubmit}><Text style={{color: 'black'}}>Submit</Text></Button>}
                {stateRef.current?.popupClose !== false && <Button buttonColor='#d32f2f' onPress={()=>{
                  if(stateRef?.current?.popupClose) stateRef?.current?.popupClose();
                  setState(p=>({...p,popupVisible: false, popupTitle: undefined, popupDescription: undefined, popupSubmit: undefined, popupClose: undefined, popupStyle: undefined, popupInputField: undefined}))
                }}>
                  <Text style={{color: 'black'}}>Cancel</Text>
                  </Button>}
              </View>
          </Card.Content>
        </Card>
        </Modal>
    }}))
  },[stateRef.current?.popupVisible, stateRef.current?.popupInputField, stateRef?.current?.popupClose])

  const snackbar = (type, content) => {
    setState(p=>({...p,...{snackbarVisible: true, snackbarType: type, snackbarContent: content}}))
  }

  const popup = ({title, description, inputField, handleSubmit, handleClose, style, closePopup}) => {
    if(closePopup === true) wipePopupData()
    else
      setState(p=>({...p,...{
        popupVisible: true, 
        popupTitle: title, 
        popupDescription: description,
        popupSubmit: handleSubmit,
        popupClose: handleClose,
        popupStyle: style,
        popupInputField: inputField
      }}))
  }

  const wipePopupData = () => {
    setState(p=>({...p,popupVisible: false, popupTitle: undefined, popupDescription: undefined, popupSubmit: undefined, popupClose: undefined, popupStyle: undefined, popupInputField: undefined}))
  }

  // End of snackbar function -------------------------------------
  // Start of Global Map Functions --------------------------------

  const setDynamicMap=(data, func, map, id)=>{
    if(data && func)
    {
      if(data?._id) func(p => p.set(data?._id, data)); // Set the data with _id
      else if (id) func(p => p.set(id, data)); // Set the data with provided id
      else if (map) func(p => p.set(map.size, data)) // Set the data with the size of the map
      else // Missing id or _id
      {
        console.log("Missing provided id or _id")
        func(p => p.set(data));
      }

      func(p => new Map(p)); // Force a re-render of the map
    }
    else data ? console.log("Function is not defined") : console.log("Data is not defined")
  }

  const setDynamicUserMap = useCallback((data, callBK)=>{
    // Update UserMap state
      Promise.all(
        Object.entries(data).flatMap(async ([key, value]) => setUserMap(p => {
          p.set(key, value);
          return p;
        }))).then((p)=>{
          // Store values locally
          LS_UserMap(data);
          if(callBK) callBK({valid: true, info: p});
          else setUserMap(p => new Map(p));
      })
  },[]);

  const dynamicMapData = useCallback((data, dataPointSet, callBK) => {//startTransition(()=>{
    if (data) Promise.all(Object.entries(data).flatMap(async([k, v]) => dataPointSet(p => { 
           /* if (p.has(k)) { var { added, deleted, updated } = detailedDiff(p.get(k), v)
                if ((Object.keys(added).length + Object.keys(deleted).length + Object.keys(updated).length) > 0) p.set(k, v)
            } else */
        p.set(k, v);
        return p;
        }))).then((p) => {
            if (callBK) callBK({valid: true, res: p})
            else dataPointSet(p=> new Map(p))
        })
    // })
    }, []);


  // End of Global Map Functions ----------------------------------

   // Switch Between Modules Functions -------------------------------
   const setModule = (module, navigation) => {
    if(!UserMap) return;

    update({database: "Companies", collection: UserMap.get('company'), query:{'_id': UserMap.get('_id')}, data:{$set: {PageID: module}}, returnVal: true}, (x)=>{
      if(x.success === false) console.log("An error occurred:", x.info)
      else if(x.success === true && x.info?._id) {
        setDynamicUserMap(x.info)
        console.log(x)
  }});
    if(isMobile)
    navigation.navigate(module);
  }
  // End of switch Between Modules Functions --------------------------

  useEffect(()=>{ // This only should fire on startup (ensure that there is no previous session before initializing login page)
    if(!routeNameRef.current) setScreenID(p=> p.set("screenID", "Splash"));
  },[routeNameRef.current])

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  const props = { globalState, read, create, update, deleteVal, isMobile, setDynamicMap, setDynamicUserMap, Stack, LS_UserMap, Remove_LC_UserMap, Get_LC_UserMap, snackbar, setModule, popup }

  return (
    <PaperProvider theme={darkTheme}>
        <SafeAreaView style={styles.safeArea}>
        {stateRef.current.snackbar}
        <NavigationContainer ref={navigationRef} 
        onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute().name;
          // Set global state with current stringID
          setScreenID(p=> p.set("screenID", currentRouteName));
          if (previousRouteName !== currentRouteName) {
            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;
          }
        }}>
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle:{...styles.safeArea, ...{width: windowDimensions.width, height: windowDimensions.height}}}}>
                <Stack.Screen
                  name="Splash"
                  component={Splash}
                  initialParams={props}
                  options={{title: 'Welcome'}}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  initialParams={props}
                  options={{title: 'Welcome'}}
                />
                <Stack.Screen
                  name="MainScreen"
                  component={MainScreen}
                  initialParams={props}
                  options={{title: 'Welcome'}}
                />
      </Stack.Navigator>
          </NavigationContainer> 
          <Portal>{stateRef.current?.popup}</Portal>
          <Portal>{stateRef.current?.snackbar}</Portal>
        </SafeAreaView>
    </PaperProvider>
  );
}
