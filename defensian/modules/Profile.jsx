import React, { Component, useEffect, useRef, forwardRef } from 'react';
import { Avatar, Card, Drawer, Button, IconButton, Icon, Text, TextInput, DefaultTheme, BottomNavigation, Divider, SegmentedButtons, ToggleButton } from 'react-native-paper';
import { TouchableWithoutFeedback as RNTouchableWithoutFeedback } from 'react-native';
import { useAtom } from 'jotai'

import NotificationCenter from './NotificationCenter';

import useState from 'react-usestateref';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
  ImageBackground,
  Animated
} from 'react-native';
import { ListItem } from '@rneui/base';

import { storage } from '../App.js';

const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    text: '#ebe8e8', // Active text color
    placeholder: '#8c8c8c', // Inactive text color
    background: '#333333', // Background color
    primary: '#ebe8e8', // Label color
    onSurfaceVariant: '#ebe8e8'
  }
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^(?! +)[^ ]/;

const Profile =({navigation, route})=> {

  const {globalState, read, create, update, isMobile, setDynamicMap, setDynamicUserMap, Stack, LS_UserMap, Get_LC_UserMap, setModule, popup, snackbar} = route.params  // get props from stack navigator (global state)

    const mainState = useState(Object);
    const outputState = useState(Object);
    const [,setState, stateRef] = mainState;
    const [,setOutput, outputRef] = outputState;
    const [socketState, setSocketState] = useAtom(globalState.socketState)
    const [UserMap, setUserMap] = useAtom(globalState.userMapState)
    const [UserObj, setUserObj] = useAtom(globalState.userObjState)
    const [value, setValue] = useState('Notifications');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [windowDimensions, ] = useAtom(globalState.windowSize);
    
      // Define the initial animated value
      const indicatorPosition = useRef(new Animated.Value(0)).current;
    
      // Define button widths and initial offset
      const buttonWidth = 100; // Adjust based on your design
      const initialOffset = 10; // Adjust based on spacing between buttons
    
      const handleButtonPress = (index) => {
        // Calculate the new position for the sliding indicator
        const newPosition = index * (buttonWidth + initialOffset);
    
        // Animate to the new position
        Animated.spring(indicatorPosition, {
          toValue: newPosition,
          useNativeDriver: true, // To optimize performance
        }).start();
    
        setSelectedIndex(index);

        console.log('New position:', newPosition); // Check what this outputs
      };

    useEffect(()=>{
      if(UserMap.get('PageID') !== "Profile") setModule("Profile", navigation);
    },[])

    // Dynamically Sizes the Profile Avatar
    const getAvatarSize = () => {
      return (windowDimensions.width + windowDimensions.height) / 12;
    }
    // Dynamically Get Button Icon Size
    const getButtonIconSize = () => {
      return (windowDimensions.width + windowDimensions.height) / 55;
    }
    // Dynamically Moves the Profile Avatar to the right screen position
    const getAvatarBottom = () => {
      return  (-(getAvatarSize() / 2));
    }
    // Dynamically Set Profile Font to Correct Size
    const getProfileFont = () => {
      return windowDimensions.height / 35
    }
    // Dynamically Get Button Width
    const getButtonWidth = () => {
      // If is Desktop View
      // Include these lines if you want a side bar instead of horizontal one -----
          // if(!isMobile)
          //   return (windowDimensions.width - (windowDimensions.width > 500 ? (windowDimensions.width * 0.2) : (windowDimensions.width * 0.3))) / 3;
          // else
      // ------------------
        return windowDimensions.width / 3;
    }
    const getBannerWidth = () => {
      // If is Desktop View
      if(!isMobile)
        return (windowDimensions.width - (windowDimensions.width > 500 ? (windowDimensions.width * 0.2) : (windowDimensions.width * 0.3)));
      else
        return windowDimensions.width;
    }

// Notification StyleSheets ---------------------------------------
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#121212',
        //borderRadius: 5,
    },
    topText: {
      display: 'flex',
      justifyContent: 'center',
      padding: '0.5%',
      fontSize: 22,
    },
    BannerImage: {
      width:'100%',//getBannerWidth(), 
      height:windowDimensions.height / 4.5, 
      alignItems:'center',
      position: 'relative'
    },
    AvatarImage: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: "column",
      backgroundColor: '#f0f0f0',
    },
    AvatarBox: {
      display: 'flex',
      position: 'absolute',
      margin: 'auto',
      bottom: getAvatarBottom(),
    },
    profileTextBox: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: '2%',
      bottom: getAvatarBottom()
    },
    ProfileFont: {
      color: '#f0f0f0', 
      fontSize: getProfileFont(),
      paddingBottom: '2%'
    },
    divider: {
      width: '100%',
      height: '1%',
    },
    profileButtonMenu: {
      flexDirection: 'row',
      width: '100%',
      //paddingTop: '1%',
      backgroundColor: "#262626",
      borderRadius: 0,
      
    },
    profileButton: {
      color: 'black',
      width: '100%',
      borderRadius: 0,
      width: '100%'
    },
    squareContent: {
      width: getButtonWidth(),
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: '1%',
    },
    ButtonText: {
      color: '#f0f0f0',
      fontSize: 17
    },
    slidingIndicator: {
      height: 2, // Adjust height of the sliding indicator
      backgroundColor: '#f0f0f0', // Change to a visible color
      position: 'absolute', // Position the indicator absolutely
      bottom: 0, // Place at the bottom
    },
    bottomContentBox: {
     // width: '100%',
     // height: '100%',
     padding: '1%',
     flex: 1,
      backgroundColor: '#121212',
     // bottom: getAvatarBottom()-1,
      marginTop: -(getAvatarBottom()-1),
      paddingTop: '0.5%',
    },
    passwordButtonContent: {
      display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', paddingVertical: '5%'
    },
    submitButtonContent: {
      display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', paddingVertical: '5%'
    },
    usernameButtonContent: {
      display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', paddingVertical: '5%'
    }
  });
  // End of Notification StyleSheets --------------------------------

  // Action when logging out -------------------------------
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
  // -------------------------------------------------------

  // Change Username ---------------------------------
  const changeUsername = () => {
    if(outputRef?.current?.createUsername) {
      update({database: "Companies", collection: UserMap.get('company'), query:{'_id': UserMap.get('_id')}, authorizationToken: UserMap.get('secretToken'), data:{$set: {username: outputRef?.current?.createUsername}}, returnVal: true}, (x)=>{
        if(x.success === false) {console.log("An error occurred:", x.info); snackbar('error', 'Failed to update username')}
        else if(x.success === true && x.info?._id) {
          setDynamicUserMap(x.info);
          snackbar('success', 'Username successfully changed');
          closePopup();
      }})
    }
    else snackbar('error', 'You did not provide a valid Username!')
  }
  useEffect(()=>{
    if(stateRef?.current?.usernamePopup === true) 
      popup(
        {
          title: "Change Username", 
          inputField: <View style={{padding: '3%'}}><TextInput
          style={{backgroundColor: '#323232'}}
          label="Change Your Username"
          value={outputRef?.current?.createUsername !== undefined ? outputRef?.current?.createUsername : ''}
          cursorColor='#ebe8e8'
          selectionColor='#ebe8e8'
          mode='outlined'
          outlineColor={stateRef?.current?.createUsernameFailure === false && outputRef?.current?.createUsername ? '#45d645' : null}
          activeOutlineColor={stateRef?.current?.createUsernameFailure === false && outputRef?.current?.createUsername ? '#45d645' : null}
          theme={darkTheme}
          error={stateRef?.current?.createUsernameFailure}
          activeUnderlineColor='#ebe8e8'
          textColor='#ebe8e8'
          onChangeText={text => {
              setOutput(p=>({...p,createUsername:text})); 
                  if(outputRef?.current?.createUsername && usernameRegex.test(outputRef?.current?.createUsername))
                      setState(p=>({...p,...{reload: !stateRef?.current?.reloadUsername, createUsernameFailure: false}}))
                  else
                      setState(p=>({...p,...{reload: !stateRef?.current?.reloadUsername, createUsernameFailure: true}}))
          }}
          />
          </View>,
          description: "Change your Username in the following field", 
          handleSubmit: changeUsername,
          handleClose: closePopup
        }
        )                 
  },[stateRef?.current?.reloadUsername, outputRef?.current, stateRef?.current?.usernamePopup])

  const closePopup = () => {
    setState(p=>({...p,usernamePopup: false, passwordPopup: false}));
    setOutput(p=>({...p,createUsername: undefined,createPassword: undefined}));
    popup({closePopup: true});
  }
  // End of Change Username ------------------------------

  // Change Password ----------------------------------
  const changePassword = () => {
    if(outputRef?.current?.createPassword && passwordRegex.test(outputRef?.current?.createPassword)) {
      update({database: "Companies", collection: UserMap.get('company'), query:{'_id': UserMap.get('_id')}, authorizationToken: UserMap.get('secretToken'), data:{$set: {password: outputRef?.current?.createPassword}}, returnVal: true}, (x)=>{
        if(x.success === false) console.log("An error occurred:", x.info)
        else if(x.success === true && x.info?._id) {
          setDynamicUserMap(x.info);
          snackbar('success', 'Password successfully changed');
          closePopup();;
      }})
    }
    else snackbar('error', 'You did not provide a valid Password!')
  }
  useEffect(()=>{
    if(stateRef?.current?.passwordPopup === true) popup
    ({
        title: "Change Password",
        inputField: <View style={{padding: '2%'}}>
                      <View style={{marginBottom: '1%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Card mode="outlined" style={{backgroundColor: '#323232', top: 2, width: '90%'}}>
                            <Card.Content>
                                <Text style={{display: 'flex', justifyContent: 'center', color: '#ebe8e8'}}>Password Must Contain:</Text>
                                <View style={{padding: '1%'}}>
                                    <Text style={{color: '#ebe8e8', padding: '1%'}}>{`\u2022 8 characters`}</Text>
                                    <Text style={{color: '#ebe8e8', padding: '1%'}}>{`\u2022 1 special character (!@$%&*)`}</Text>
                                    <Text style={{color: '#ebe8e8', padding: '1%'}}>{`\u2022 1 upper case letter`}</Text>
                                    <Text style={{color: '#ebe8e8', padding: '1%'}}>{`\u2022 1 lower case letter`}</Text>
                                </View>
                            </Card.Content>
                        </Card>
                        </View>
                            <TextInput
                            style={{backgroundColor: '#323232'}}
                            label="Change Your Password"
                            value={outputRef?.current?.createPassword !== undefined ? outputRef?.current?.createPassword : ''}
                            cursorColor='#ebe8e8'
                            selectionColor='#ebe8e8'
                            mode='outlined'
                            outlineColor={stateRef?.current?.createPasswordFailure === false && outputRef?.current?.createPassword ? '#45d645' : null}
                            activeOutlineColor={stateRef?.current?.createPasswordFailure === false && outputRef?.current?.createPassword ? '#45d645' : null}
                            theme={darkTheme}
                            error={stateRef?.current?.createPasswordFailure}
                            secureTextEntry={stateRef?.current?.hidePasswordCreate}
                            right={<TextInput.Icon color="#ebe8e8" icon={stateRef?.current?.eyeCreateIcon} onPress={()=>{
                                setState(p=>({...p,...{
                                    hidePasswordCreate: !stateRef?.current?.hidePasswordCreate, 
                                    eyeCreateIcon: stateRef?.current?.eyeCreateIcon === "eye-outline" ? "eye-off-outline" : "eye-outline"
                                }}))}}/>}
                            activeUnderlineColor='#ebe8e8'
                            textColor='#ebe8e8'
                            accessibilityLabel={outputRef?.current?.createPassword !== undefined ? outputRef?.current?.createPassword : ''}
                            onChangeText={text => {
                                setOutput(p=>({...p,...{createPassword:text}}))

                                if(passwordRegex.test(outputRef?.current?.createPassword)) // make sure password is correct
                                {
                                    setState(p=>({...p,...{
                                        createPasswordFailure: false,
                                        reload: !stateRef?.current?.reload
                                    }}))
                                }
                                else
                                {
                                    setState(p=>({...p,...{
                                        createPasswordFailure: true,
                                        reload: !stateRef?.current?.reload
                                    }}))
                                }
                            
                            }
                            }
                            />
                      </View>,
        description: "Change your Password in the following field", 
        handleSubmit: changePassword,
        handleClose: closePopup,
      })

  },[stateRef?.current?.passwordPopup, outputRef?.current, outputRef?.current?.createPassword])
  // End of Change Password ------------------------------

  // Triple button animation for profile (notifications, edit profile, logout) ------------
  useEffect(()=>{
    const buttonWidth =  getButtonWidth()
    //const initialOffset = 10
    // Calculate the new position for the sliding indicator
    const newPosition = selectedIndex * (buttonWidth );

    // Animate to the new position
    Animated.spring(indicatorPosition, {
      toValue: newPosition,
      useNativeDriver: true, // To optimize performance
    }).start();

    setState(p=>({...p,
      ToggleButtonProfile:<View style={styles.profileButtonMenu}>
        <Pressable onPress={()=>setSelectedIndex(0)} style={styles.squareContent}>
          <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Avatar.Icon size={getButtonIconSize()} style={{backgroundColor: 'rgba(52, 52, 52, 0)'}} icon={value === "Notifications" ? 'bell' : 'bell-outline'}/>
            <Text style={styles.ButtonText}>Notifications</Text>
          </View>
          </Pressable>
        <Pressable onPress={()=>setSelectedIndex(1)} style={styles.squareContent}>
          <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Avatar.Icon size={getButtonIconSize()} style={{backgroundColor: 'rgba(52, 52, 52, 0)'}} icon={value === "account-edit" ? 'bell' : 'account-edit-outline'}/>
            <Text style={styles.ButtonText}>Edit Profile</Text>
          </View>
        </Pressable>
        <Pressable onPress={()=>{setSelectedIndex(2);Logout()}} style={styles.squareContent}>
          <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Avatar.Icon size={getButtonIconSize()} style={{backgroundColor: 'rgba(52, 52, 52, 0)'}} icon='logout'/>
            <Text style={styles.ButtonText}>Log Out</Text>
          </View>
        </Pressable>
        <Animated.View
        style={[
          styles.slidingIndicator,
          { width: buttonWidth, transform: [{ translateX: indicatorPosition }] },
        ]}
      />
       </View>
    }))
  },[UserMap,selectedIndex,windowDimensions])
  // End of triple buttons -----------------------------

  // Profile Text (Name and Greeting) ------------
  useEffect(()=>{
    setState(p=>({...p,
      ProfileText: <View style={{paddingBottom: '1%'}}><Text style={styles.ProfileFont}>{`Hi, ${UserMap.get('firstName')} ${UserMap.get('lastName')}`}</Text><Text style={{...styles.ProfileFont, fontSize: (getProfileFont()/1.5), display: 'flex', justifyContent: 'center'}}>{UserMap.get('company')}</Text></View>,
    }))
  },[UserMap])
  // --------------------

  // Check if email is valid -----------
  const isValidEmail = (email) => {
    // Regular expression for the described pattern
    const emailPattern = /^[^@]+@[^.]+\.[^.]+$/;
  
    // Test if the email matches the pattern
    return emailPattern.test(email);
  };
  // ---------------------------

  // Submit Profile Changes to database (name and email) ---------------
  const submit_name_email_edits = () => {
    // Saftey Checks
    if (outputRef.current.createEmail && !isValidEmail(outputRef.current.createEmail)) {snackbar('error', 'You must have a valid email entered to update field(s) !'); return;}
    if (outputRef.current.createFirstname && !usernameRegex.test(outputRef?.current?.createFirstname)) {snackbar('error', 'You must have a valid first name entered to update field(s) !'); return;}
      if (outputRef.current.createLastname && !usernameRegex.test(outputRef?.current?.createLastname)) {snackbar('error', 'You must have a valid last name entered to update field(s) !'); return;}
    // Submission object
    var edits = {}
    if (outputRef.current?.createFirstname) edits.firstName = outputRef.current.createFirstname;
    if (outputRef.current?.createLastname) edits.lastName = outputRef.current.createLastname;
    if (outputRef.current?.createEmail) edits.email = outputRef.current.createEmail;

    update({database: "Companies", collection: UserMap.get('company'), query:{'_id': UserMap.get('_id')}, authorizationToken: UserMap.get('secretToken'), data:{$set: edits}, returnVal: true}, (x)=>{
      if(x.success === false) {console.log("An error occurred:", x.info); snackbar('error', 'Failed to update profile')}
      else if(x.success === true && x.info?._id) {
        setDynamicUserMap(x.info);
        snackbar('success', 'Profile successfully changed');
        setOutput(p=>({...p,createFirstname: undefined, createLastname: undefined, createEmail: undefined}));
        setState(p=>({...p,createFirstnameFailure: undefined, createLastnameFailure: undefined, createEmailFailure: undefined}))
    }})
  }
  // End of Submit profile changes to database (name and email) ----------------

  // Bottom section of profile (notification tab, edit profile tab, logout tab) -----------
  useEffect(()=>{
    if(selectedIndex === 0)
      setState(p=>({...p,
        bottomContent: <View style={styles.bottomContentBox}>
          <ScrollView style={{paddingTop: '1%'}}>
            <NotificationCenter navigation={navigation} route={route}/>
            </ScrollView>
          </View>
      }))
    else if (selectedIndex === 1)
      setState(p=>({...p,
        bottomContent: <View style={styles.bottomContentBox}>
              <View style={{display:'flex', flexDirection: 'row', gap: 4}}>
                            <TextInput
                            style={{backgroundColor: '#323232', flex: 1}}
                            label="Edit Your First Name"
                            value={outputRef?.current?.createFirstname !== undefined ? outputRef?.current?.createFirstname : ''}
                            outlineColor={stateRef?.current?.createFirstnameFailure === false && outputRef?.current?.createFirstname ? '#45d645' : null}
                            activeOutlineColor={stateRef?.current?.createFirstnameFailure === false && outputRef?.current?.createFirstname ? '#45d645' : null}
                            cursorColor='#ebe8e8'
                            selectionColor='#ebe8e8'
                            mode='outlined'
                            theme={darkTheme}
                            error={stateRef?.current?.createFirstnameFailure}
                            activeUnderlineColor='#ebe8e8'
                            textColor='#ebe8e8'
                            onChangeText={text => {
                                setOutput(p=>({...p,...{createFirstname:text}}));
                                if(usernameRegex.test(outputRef?.current?.createFirstname))
                                    setState(p=>({...p,...{reload: !stateRef?.current?.reload, createFirstnameFailure: false}}))
                                else
                                    setState(p=>({...p,...{reload: !stateRef?.current?.reload, createFirstnameFailure: true}}))
                            }
                        }
                        />
                        <TextInput
                            style={{backgroundColor: '#323232', flex: 1}}
                            label="Edit Your Last Name"
                            value={outputRef?.current?.createLastname !== undefined ? outputRef?.current?.createLastname : ''}
                            cursorColor='#ebe8e8'
                            selectionColor='#ebe8e8'
                            mode='outlined'
                            outlineColor={stateRef?.current?.createLastnameFailure === false && outputRef?.current?.createLastname ? '#45d645' : null}
                            activeOutlineColor={stateRef?.current?.createLastnameFailure === false && outputRef?.current?.createLastname ? '#45d645' : null}
                            theme={darkTheme}
                            error={stateRef?.current?.createLastnameFailure}
                            activeUnderlineColor='#ebe8e8'
                            textColor='#ebe8e8'
                            onChangeText={text => {
                                setOutput(p=>({...p,...{createLastname:text}}));
                                if(usernameRegex.test(outputRef?.current?.createLastname))
                                    setState(p=>({...p,...{reload: !stateRef?.current?.reload, createLastnameFailure: false}}))
                                else
                                    setState(p=>({...p,...{reload: !stateRef?.current?.reload, createLastnameFailure: true}}))
                            }
                        }
                        />
                    </View>
                    <TextInput
                    style={{backgroundColor: '#323232', height: '100%'}}
                    label={stateRef?.current?.createEmailFailure === true ? 'Enter a Valid Email' : 'Enter a Email'}
                    value={outputRef?.current?.createEmail !== undefined ? outputRef?.current?.createEmail : ''}
                    cursorColor='#ebe8e8'
                    selectionColor='#ebe8e8'
                    outlineColor={stateRef?.current?.createEmailFailure === false && outputRef?.current?.createEmail ? '#45d645' : null}
                    activeOutlineColor={stateRef?.current?.createEmailFailure === false && outputRef?.current?.createEmail ? '#45d645' : null}
                    mode='outlined'
                    theme={darkTheme}
                    error={stateRef?.current?.createEmailFailure}
                    activeUnderlineColor='#ebe8e8'
                    textColor='#ebe8e8'
                    onChangeText={text => {
                            setOutput(p=>({...p,...{createEmail:text}})); 

                            if(isValidEmail(outputRef?.current?.createEmail) === false) 
                            {
                                setState(p=>({...p,...{createEmailFailure: true, reload: !stateRef?.current?.reload}}))
                            }
                            else 
                            {
                                setState(p=>({...p,...{createEmailFailure: false, reload: !stateRef?.current?.reload}}))
                            }
                        }
                    }
                />
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '1%', marginBottom: '1%', gap: '2%' }}>
                  <View style={{width: '20%', height: '100%', justifyContent: 'center'}}><Button buttonColor='#363636' textColor='#ebe8e8' mode='elevated' labelStyle={{ fontSize: windowDimensions.width<500 ? 16 : 20}} contentStyle={styles.usernameButtonContent} dark={true} onPress={()=>{ 
                    setState(p=>({...p,usernamePopup: true, reloadUsername: !stateRef?.current?.reloadUsername}));
                   }}>
                      Change Username
                  </Button></View>
                  <View style={{width: '20%', height: '100%', justifyContent: 'center'}}><Button buttonColor='#363636' textColor='#ebe8e8' mode='elevated' labelStyle={{ fontSize: windowDimensions.width<500 ? 16 : 20}} contentStyle={styles.passwordButtonContent} dark={true} onPress={()=>{
                     setState(p=>({...p,passwordPopup: true, reloadPassword: !stateRef?.current?.reloadPassword}));
                  }}>
                    Change Password
                  </Button></View>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '2%' }}>
                <View style={{width: '20%', height: '100%', justifyContent: 'center'}}>
                  <Button textColor={(Object.keys(outputRef.current).filter(x=>['createEmail', 'createLastname', 'createFirstname'].includes(x)).length > 0) ? '#ebe8e8' : '#4d4d4d'} buttonColor={(Object.keys(outputRef.current).filter(x=>['createEmail', 'createLastname', 'createFirstname'].includes(x)).length > 0) ? '#363636' : '#242424'} labelStyle={{ fontSize: windowDimensions.width<500 ? 16 : 20}} contentStyle={styles.submitButtonContent} dark={true}
                  onPress={submit_name_email_edits}
                  >
                    Submit
                  </Button>
                  </View>
                  </View>
                </View>
      }))
  },[selectedIndex, outputRef.current])
  // End of Bottom section of profile (notification tab, edit profile tab, logout tab) -----------

return <View style={styles.container}>
  <ScrollView>
    <ImageBackground source={require("../img/3.png")} resizeMode="stretch" style={styles.BannerImage}>
      <View style={styles.AvatarBox}><Avatar.Image size={getAvatarSize()} source={require("../img/Designer.png")} style={styles.AvatarImage}/></View>
    </ImageBackground>
    <View style={styles.profileTextBox}>
      {stateRef.current.ProfileText}
      <Divider bold={true} style={styles.divider}/>
      {stateRef.current.ToggleButtonProfile}
    </View>
    {stateRef.current.bottomContent}
    </ScrollView>
</View>
}

export default Profile;