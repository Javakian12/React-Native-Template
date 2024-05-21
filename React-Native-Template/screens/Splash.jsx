import React, { useEffect, useRef } from 'react';
import { ImageBackground, View } from 'react-native';
import useState from 'react-usestateref';
import { storage } from '../App';
import { ActivityIndicator, Card, Button } from 'react-native-paper';
import { useAtom } from 'jotai'

const Splash = ({route, navigation}) =>{
    const { globalState, read, create, update, isMobile, setDynamicMap, setDynamicUserMap, Stack, LS_UserMap, Remove_LC_UserMap } = route.params  // get props from stack navigator (global state)
    const [UserMap, setUserMap] = useAtom(globalState.userMapState)
    const [socketState, setSocketState] = useAtom(globalState.socketState)
    const [screenID,setScreenID] = useAtom(globalState.screenID)
    const mainState = useState(Object);
    const [,setState, stateRef] = mainState;
    const [windowDimensions, ] = useAtom(globalState.windowSize);

    if(socketState.size > 0) var socketIO = socketState.get('socketIO')

    // Login If Previous Session Existed
    const Login = (value) => {
        read({action: "Login", database: "Companies", collection: value.company, _id: undefined, query: {secretToken: value?.secretToken, username: value?.username}}, (x)=>{
            if(x.status === true) // found user
            {
                if(x.info !== value || (!UserMap || UserMap.size === 0))
                {
                    //setUserMap(new Map())
                    setDynamicUserMap(x.info)
                    LS_UserMap()
                }
                setScreenID(p=>p.set('screenID','MainScreen'));
                navigation.navigate('MainScreen') // Navigate to home page
            }
            else if(x.status === false)
            {
                console.log("An error ocurred:", x.info)
                Remove_LC_UserMap()
                navigation.navigate('Login');
            }
        })
    }

    // Logout
    const Logout = () => {
        // Clear all data
        storage.clearAll();
  
        setUserMap(p => p.delete(p))
  
        navigation.navigate('Login') // Navigate to home page
      }

    // Get UserMap from Local Storage
    const getUserMap = async () => {
        try {
            var value = storage.getString('UserMap');
            if (value) {
            // value previously stored
            // Convert back into Object
            value = await JSON.parse(value);
            //  setDynamicUserMap(value);
            Login(value)
            }
            else navigation.navigate('Login');
        } catch (e) {
            console.log("Error while getting usermap:", e)
            navigation.navigate('Login');
        }
        };

    useEffect(()=>{
        if ((!UserMap || UserMap.size === 0) && screenID.get('screenID') === "Splash") getUserMap();
        else if (screenID.get('screenID') === "Splash") navigation.navigate('Login');
        else if (screenID.get('screenID') === undefined) navigation.navigate('Login');
    },[socketIO?.connected, screenID])

    // End of previous session logins ------------------------

    // Helper card
    useEffect(()=>{
        setTimeout(()=>{
            setState(p=>({...p,...{
                LoadingCard: true
            }}))
        },4000)
    },[]) //'#ebe8e8'

    return <View style={{flex: 1, overflow: 'hidden', alignItems: 'center' }}><ImageBackground source={require("../img/3.png")} resizeMode="stretch" style={{width:windowDimensions.width, height:windowDimensions.height, alignItems:'center'}}>
        {stateRef.current?.LoadingCard && stateRef.current?.LoadingCard === true && <Card style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', backgroundColor: '#ebe8e8'}}>
            <Card.Title title="Connecting to Server" style={{color: 'black'}}/>
            <Card.Content>
                <ActivityIndicator animating={true} size={'large'} color={"lightblue"}/>
                <View style={{paddingTop: '10%'}}><Button onPress={Logout} buttonColor='#696d6e' textColor='white'>Logout</Button></View>
            </Card.Content>
        </Card> }
        </ImageBackground></View>

}
export default Splash;