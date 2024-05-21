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
  Dimensions,
  Modal,
} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';

// Imports from Modules
import Home from '../modules/Home.jsx';
import Profile from '../modules/Profile.jsx';
import Store from '../modules/Store.jsx';

import {createStackNavigator} from '@react-navigation/stack';

import { useAtom } from 'jotai'

// Local Storage
import { storage } from '../App.js';

const ModuleStack = createStackNavigator();

const HomeRoute = ({navigation, route}) => <Home navigation={navigation} route={route}/>;

const SiteRoute = ({navigation, route}) => <Store navigation={navigation} route={route}/>;

const ProfileRoute = ({navigation, route}) => <Profile navigation={navigation} route={route}/>;

const MainScreen =({navigation, route})=> {
    const {globalState, read, create, update, isMobile, setDynamicMap, setDynamicUserMap, Stack, LS_UserMap, Get_LC_UserMap, setModule, popup} = route.params  // get props from stack navigator (global state)

    const mainState = useState(Object);
    const outputState = useState(Object);
    const [,setState, stateRef] = mainState;
    const [,setOutput, outputRef] = outputState;
    const [socketState, setSocketState] = useAtom(globalState.socketState)
    const [UserMap, setUserMap] = useAtom(globalState.userMapState)
    const [UserObj, setUserObj] = useAtom(globalState.userObjState)
    const [windowDimensions, setWindowDimensions] = useAtom(globalState.windowSize);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('');
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'home', title: 'Home', focusedIcon: 'shield-home', unfocusedIcon: 'shield-home-outline'},
      { key: 'Store', title: 'Store', focusedIcon: 'sitemap', unfocusedIcon: 'sitemap-outline' },
      { key: 'profile', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline' },
    ]);

    const sceneBackground = "#121212"

    const renderScene = BottomNavigation.SceneMap({
      home: ()=>HomeRoute({navigation, route}),
      Store: ()=>SiteRoute({navigation, route}),
      profile: ()=>ProfileRoute({navigation, route}),
    });

    const props = route.params; // For passing props to the new stack navigator

    // Store UserMap in local storage

    function isOutsideViewbox(screenX, screenY){
      console.log(UserMap)

      isMobile?'60%':windowDimensions.width>500?'35%':'60%'
      const viewHeight = windowDimensions.height * 1; // Replace 0.97 with % size of viewbox
      const viewHeightPadding = (windowDimensions.height - viewHeight) / 2;
      const viewWidth = windowDimensions.width * 1; // Replace 0.97 with % size of viewbox
      const viewWidthPadding = (windowDimensions.width - viewWidth) / 2;

      const spaceBeforeWidth = viewWidthPadding; // Before viewbox
      const spaceAfterWidth = (viewWidthPadding + (isMobile ? viewWidth * 0.75 : windowDimensions.width > 500 ? viewWidth * 0.35 : viewWidth * 0.60)); // After viewbox

      const spaceBeforeHeight = viewHeightPadding; // Bottom of screen
      const spaceAfterHeight = windowDimensions.height - viewHeightPadding; // Top of screen

      if((screenX < spaceBeforeWidth || screenX > spaceAfterWidth) || (screenY < spaceBeforeHeight || screenY > spaceAfterHeight)) // If click is not inside viewbox
      {
        setOpen(false)
      }
    }

    const setScreenIndex=(screen)=>{
      if (screen === "Home") return 0;
      else if (screen === "Store") return 1;
      else if (screen === "Profile") return 2;
    }

    useEffect(()=>{ // Set the default page of the user
      if(UserMap.size > 0 && UserMap.get('PageID') && !isMobile)
      {
        navigation.navigate('MainScreen', {screen: UserMap.get('PageID')}) // Navigate to home page
        setActive(UserMap.get('PageID'));
       // setScreenModule(UserMap.get('PageID'))
      }
      else if(UserMap.size > 0 && UserMap.get('PageID') && isMobile)
      {
        //setScreenIndex(UserMap.get('PageID'))
        setIndex(setScreenIndex(UserMap.get('PageID')))
      }
    },[UserMap.get('PageID')])


    const handlePress = (event) => {
      // get the click position relative to the screen
      const screenX = event.nativeEvent.pageX;
      const screenY = event.nativeEvent.pageY;

      isOutsideViewbox(screenX, screenY); //Action to close menu
    };

    // Switch Between Modules Functions -------------------------------
    const setScreenModule = (module) => {
      if(!UserMap) return;
      setActive(module);

      update({database: "Companies", collection: UserMap.get('company'), query:{'_id': UserMap.get('_id')}, data:{$set: {PageID: module}}, returnVal: true}, (x)=>{
        if(x.success === false) console.log("An error occurred:", x.info)
        else if(x.success === true && x.info?._id) {
          setDynamicUserMap(x.info)
    }});
      if(!isMobile)
      navigation.navigate('MainScreen', {screen: module});
    }
    // End of switch Between Modules Functions --------------------------

    const logoutActions = () => {
      storage.clearAll();

      setUserMap(p => p.delete(p))

      setUserMap(new Map())
      
      //Close the popup
      popup({closePopup: true})

      navigation.navigate('Login') // Navigate to home page
    }

    const Logout = () => {
      popup({title: "Log Out", description: "Are you sure you want to log out?", handleSubmit: logoutActions})
    }

    const getScreenContentHeight=()=>{
      return windowDimensions.height - (windowDimensions.height * 0.07);
    }

    useEffect(()=>{
      if(!isMobile)
      setState(p=>({...p,
        stackNav: <View style={{display: 'flex', width: windowDimensions.width, height: getScreenContentHeight()}}><ModuleStack.Navigator screenOptions={{ headerShown: false, cardStyle: {backgroundColor: '#7c7d7d'}}}>
            <ModuleStack.Screen
            name="Home"
            component={Home}
            initialParams={props}
            options={{title: 'Welcome'}}
          />
            <ModuleStack.Screen
            name="Store"
            component={Store}
            initialParams={props}
            options={{title: 'Welcome'}}
          />
          <ModuleStack.Screen
            name="Profile"
            component={Profile}
            initialParams={props}
            options={{title: 'Welcome'}}
          />
        </ModuleStack.Navigator> 
        </View>
      }))
    },[windowDimensions])

    /*
 <View style={{height: '100%', width: '100%',  backgroundColor: open && open === true && 'rgba(79,80,82,0.9)', position: 'absolute', zIndex: 999}}>
        <Drawer.Section
          title="Modules"
          style={{ backgroundColor: 'white', width: isMobile ? '60%' : windowDimensions.width > 500 ? '35%' : '60%', height: '100%'}}
          showDivider={false}
        >
          <Drawer.Item
              style={{ backgroundColor: active === "Home" && '#89B9D5' }}
              icon="home"
              label="Home"
              active={active === "Home"}
              onPress={()=>setScreenModule("Home")}
            />
          <Drawer.Item
              style={{ backgroundColor: active === "Store" && '#89B9D5' }}
              icon="office-building-marker"
              label="Store"
              active={active === "Store"}
              onPress={()=>setScreenModule("Store")}
            />
          <Drawer.Item
              style={{ backgroundColor: active === "Profile" && '#89B9D5' }}
              icon="account"
              label="Profile"
              active={active === "Profile"}
              onPress={()=>setScreenModule("Profile")}
            />
          <Divider bold={true}/>
          <Drawer.Item
            icon="logout"
            label="Logout"
            onPress={Logout}
          />
        </Drawer.Section>
      </View>
    */

    // Dynamically Sizes the Profile Avatar
    const getAvatarSize = () => {
      return (windowDimensions.width + windowDimensions.height) / 40;
    }

    useEffect(()=>{ // render different menus
     if(isMobile !== true)
      setState(p=>({...p,
        verticalMenu: <View style={styles.sidePanel}>
          <View style={styles.companyIcon}>
          <Avatar.Image size={getAvatarSize()} source={require("../img/Designer.png")} style={{backgroundColor: sceneBackground}}/>
          </View>
          <View style={{padding: '2%',}}>
            <Button
              style={{paddingBottom: '5%'}}
              icon="home"
              onPress={()=>setScreenModule("Home")}
              backgroundColor={sceneBackground}
              textColor='#e1e1e1'
            >
              <Text style={{borderBottomWidth: active === "Home" ? 1 : 0, borderBottomColor: '#e6e6e6', color: '#e6e6e6'}}>
                Home
              </Text>
            </Button>
            <Button
              style={{paddingBottom: '5%'}}
              icon="office-building-marker"
              onPress={()=>setScreenModule("Store")}
              backgroundColor={sceneBackground}
              textColor='#e1e1e1'
            >
              <Text style={{borderBottomWidth: active === "Store" ? 1 : 0, borderBottomColor: '#e6e6e6', color: '#e6e6e6'}}>
                Store
              </Text>
            </Button>
            <Button
              style={{paddingBottom: '5%'}}
              icon="account"
              onPress={()=>setScreenModule("Profile")}
              backgroundColor={sceneBackground}
              textColor='#e1e1e1'
            >
              <Text style={{borderBottomWidth: active === "Profile" ? 1 : 0, borderBottomColor: '#e6e6e6', color: '#e6e6e6'}}>
                My Profile
              </Text>
            </Button>
            <View style={{display: 'flex'}}>
              <Divider style={{width: '100%'}}/>
              <Button
                style={{paddingTop: '5%'}}
                icon="logout"
                onPress={Logout}
                backgroundColor={sceneBackground}
                textColor='#e1e1e1'
              >
                Log Out
              </Button>
            </View>
          </View>
        </View>,
        horizontalTopMenu: <View style={styles.topPanel}>
        <View style={styles.companyIcon}>
        <Avatar.Image size={getAvatarSize()} source={require("../img/Designer.png")} style={{backgroundColor: sceneBackground}}/>
        </View>
        <View style={{padding: '1%', gap: 5, flexDirection: 'row'}}>
          <Button
            style={{paddingBottom: '5%'}}
            icon="home"
            onPress={()=>setScreenModule("Home")}
            backgroundColor={sceneBackground}
            textColor='#e1e1e1'
          >
            <Text style={styles.buttonFontsHome}>
              Home
            </Text>
          </Button>
          <Button
            style={{paddingBottom: '5%'}}
            icon="office-building-marker"
            onPress={()=>setScreenModule("Store")}
            backgroundColor={sceneBackground}
            textColor='#e1e1e1'
          >
            <Text style={styles.buttonFontsStore}>
              Store
            </Text>
          </Button>
          <Button
            style={{paddingBottom: '5%'}}
            icon="account"
            onPress={()=>setScreenModule("Profile")}
            backgroundColor={sceneBackground}
            textColor='#e1e1e1'
          >
            <Text style={styles.buttonFontsProfile}>
              My Profile
            </Text>
          </Button>
            <Divider style={{ width: 2, height: '100%' }}/>
            <Button
              icon="logout"
              onPress={Logout}
              backgroundColor={sceneBackground}
              textColor='#e1e1e1'
            >
              <Text style={styles.buttonFontsLogout}>
                Log Out
              </Text>
            </Button>
        </View>
      </View>
      }))
     else
        setState(p=>({...p,
          horizontalMenu: <BottomNavigation
          barStyle={styles.menuBar}
          activeIndicatorStyle={styles.menuButtons}
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene} />
        }))
    },[open, index, active, windowDimensions])

    // MainScreen StyleSheets ---------------------------------------
    const styles = StyleSheet.create({
      container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#7c7d7d',
      },
      sidePanel: {
        width: windowDimensions.width > 500 ? '20%' : '30%',
      },
      topPanel: {
        width: windowDimensions.width,
        flexDirection: 'row',
        height: '7%', 
        justifyContent: 'space-around',
      },
      companyIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: '5%',
      },
      moduleBox: {
        padding: '1%',
        backgroundColor: '#7c7d7d',
       // borderRadius: 5,
       // flex: 1,
      },
      moduleButton: {
        opacity: '0.8', 
        display: 'flex', 
        marginRight: 'auto', 
        borderRadius: 0,
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 99, //ENSURE THAT CONTENT UNDERNEATH DOES NOT EXCEED THIS Z INDEX!!!!!
      },
      menuBar: {
        backgroundColor: "#f0f0f0",
      },
      menuButtons: {
       backgroundColor: "#62c7fc"
      },
      viewVertical: {flexDirection: 'row', width: '100%', height: '100%'},
      viewHorizontal: {width: '100%', height: '100%'},
      masterView: { display: 'flex', justifyContent: 'end', alignItems: 'flex-start', width: '100%', height: '100%', backgroundColor: sceneBackground },
      buttonFontsHome: {borderBottomWidth: active === "Home" ? 1 : 0, borderBottomColor: '#e6e6e6', color: '#e6e6e6', fontSize: 17},
      buttonFontsStore: {borderBottomWidth: active === "Store" ? 1 : 0, borderBottomColor: '#e6e6e6', color: '#e6e6e6', fontSize: 17},
      buttonFontsProfile: {borderBottomWidth: active === "Profile" ? 1 : 0, borderBottomColor: '#e6e6e6', color: '#e6e6e6', fontSize: 17},
      buttonFontsLogout: {color: '#e6e6e6', fontSize: 17},
    });
    // End of MainScreen StyleSheets --------------------------------

    //

    return <TouchableWithoutFeedback onPress={open === true ? handlePress : null}>
      <View style={styles.masterView}>
        
          { !isMobile ? <View style={styles.viewHorizontal}>
          {stateRef?.current?.horizontalTopMenu}
          {stateRef?.current?.stackNav}
          </View>
          
        : 
        <View style={styles.container}>
         {stateRef?.current?.stackNav}
         {stateRef?.current?.horizontalMenu}
        </View>
      }
        </View>
  </TouchableWithoutFeedback>
}


export default MainScreen