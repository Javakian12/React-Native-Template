import React, { Component, useEffect, useRef } from 'react';
import { Avatar, Button, Card, Text, TextInput, DefaultTheme, TouchableRipple, ActivityIndicator, Snackbar } from 'react-native-paper';
import PaperButton from '../components/Button';

import useState from 'react-usestateref';

import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions 
} from 'react-native';

// Local Storage
import { useAtom } from 'jotai'

const Login =({route, navigation})=> {
    const {globalState, read, create, update, isMobile, setDynamicMap, setDynamicUserMap, Stack, LS_UserMap, Remove_LC_UserMap, snackbar } = route.params  // get props from stack navigator (global state)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [createUsername, setCreateUsername] = useState("");
    const [createPassword, setCreatePassword] = useState("");
    const [email, setEmail] = useState("");
    const mainState = useState(Object);
    const outputState = useState(Object);
    const [,setState, stateRef] = mainState;
    const [,setOutput, outputRef] = outputState;
    const [failure, setFailure] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [socketState, setSocketState] = useAtom(globalState.socketState)
    const [UserMap, setUserMap] = useAtom(globalState.userMapState)
    const [windowDimensions, ] = useAtom(globalState.windowSize);

    // Snackbar stuff
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    // Socketio stuff
    if(socketState.size > 0) var socketIO = socketState.get('socketIO')

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const usernameRegex = /^(?! +)[^ ]/;

    const enableAccessCode = true;

    // Loading wheel for submit button
    const loadWheel = async (operation) => {
        try {
          // Set loading to true to show the loading indicator
          setState(p=>({...p,...{
            loadingWheel: true
          }}))
          // Perform your asynchronous operation here
          if (operation === "Login") checkLoginInfo()
          else if (operation === "Create") await checkCreateInfo()
          else if (operation === "Forgot") await checkForgotInfo()
          else if (operation === "CheckPin") await checkPin()
          // After the async task is completed, set loading back to false
        } catch (error) {
          console.error('Error:', error);
    
          // Handle the error if needed
    
          // Set loading back to false in case of an error
          setState(p=>({...p,...{
            loadingWheel: false
          }}))
        }
      };

    useEffect(()=>{
        setState(p=>({...p,...{
            hidePassword: true, // set default password text
            hidePasswordCreate: true, // set default create password text
            eyeIcon: "eye-outline", // set default password icon
            eyeCreateIcon: "eye-outline", // set default create password icon
            screen: 'Login', // set default page
            reload: false, // control reloads
        }}))
    },[])

    // If screen size changes
    // ----------------------

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

    const isValidEmail = (email) => {
        // Regular expression for the described pattern
        const emailPattern = /^[^@]+@[^.]+\.[^.]+$/;
      
        // Test if the email matches the pattern
        return emailPattern.test(email);
      };

    const forgotInfo=(email)=>{
        if(isValidEmail(email))
        {
            console.log("Valid Email is:", email)
        }
        else
        {
            setState(p=>({...p,...{
                invalidEmail: true
            }}))
        }
    }

    // Switch Pages
    useEffect(()=>{
        if(stateRef?.current?.screen === "Login") // Login Page
        {
            setState(p=>({...p,...{
                screenContent: <><View style={{marginTop: '2%', width: '70%', maxWidth: 500}}>
                <TextInput
                    style={{backgroundColor: '#323232'}}
                    label="Username"
                    value={outputRef?.current?.username !== undefined ? outputRef?.current?.username : ''}
                    cursorColor='#ebe8e8'
                    selectionColor='#ebe8e8'
                    mode='outlined'
                    theme={darkTheme}
                    error={stateRef?.current?.loginFailure}
                    activeUnderlineColor='#ebe8e8'
                    textColor='#ebe8e8'
                    onChangeText={text => setOutput(p=>({...p,...{username: text}}))}
                />
                <TextInput
                    style={{backgroundColor: '#323232'}}
                    label="Password"
                    value={outputRef?.current?.password !== undefined ? outputRef?.current?.password : '' }
                    cursorColor='#ebe8e8'
                    selectionColor='#ebe8e8'
                    mode='outlined'
                    theme={darkTheme}
                    error={stateRef?.current?.loginFailure}
                    secureTextEntry={stateRef?.current?.hidePassword}
                    right={<TextInput.Icon color="#ebe8e8" icon={stateRef?.current?.eyeIcon} onPress={()=>{
                        setState(p=>({...p,...{
                            hidePassword: !stateRef?.current?.hidePassword, 
                            eyeIcon: stateRef?.current?.eyeIcon === "eye-outline" ? "eye-off-outline" : "eye-outline"
                        }}))}}/>}
                    activeUnderlineColor='#ebe8e8'
                    textColor='#ebe8e8'
                    accessibilityLabel={outputRef?.current?.password !== undefined ? outputRef?.current?.password : ''}
                    onChangeText={text => setOutput(p=>({...p,...{password:text}}))}
                />
                </View> 
                <View style={{ marginTop: isMobile ? '5%' : '3%', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableRipple onPress={()=>{setState(p=>({...p,...{screen: 'Forgot'}}))}}>
                        <Text style={{ color: '#ebe8e8', textDecorationLine: 'underline' }}>Forgot Username/Password?</Text>
                    </TouchableRipple>
                </View>
                <View style={{ marginTop: isMobile ? '5%' : '3%', justifyContent: 'center', alignItems: 'center', width: '65%', maxWidth: 500 }}>
                <Button style={{width: '100%', maxWidth: 500, borderRadius: 4, borderColor: '#ebe8e8'}} buttonColor={stateRef?.current?.loadingWheel ? "#343536" : "#323232"} onPress={()=>{stateRef?.current?.loadingWheel !== true && loadWheel("Login")}} mode='elevated' dark={true} >
                    {stateRef?.current?.loadingWheel === true ? (
                        <ActivityIndicator animating={true} size={20} color="white" />
                    ) : (
                        <Text style={{fontSize: 16, color: "#ebe8e8"}}>
                        Continue
                        </Text>
                    )}
                </Button>
                <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 20 }}>
                    <TouchableRipple onPress={()=>{setState(p=>({...p,...{screen: 'Create'}}))}}>
                        <Text style={{ color: '#ebe8e8', textDecorationLine: 'underline' }}>Create An Account</Text>
                    </TouchableRipple>
                </View>
                </View></>
            }}))
        }
        else if (stateRef?.current?.screen === "Create") // Create an Account Page
        {
            setState(p=>({...p,...{
                screenContent: <>
                    <View style={{ width: '75%', maxWidth: 550}}>
                        <View style={{display:'flex', flexDirection: 'row', gap: 4}}>
                            <TextInput
                            style={{backgroundColor: '#323232', flex: 1}}
                            label="Enter Your First Name"
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
                            label="Enter Your Last Name"
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
                    style={{backgroundColor: '#323232'}}
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
                <TextInput
                    style={{backgroundColor: '#323232'}}
                    label="Create A Username"
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
                        setOutput(p=>({...p,...{createUsername:text}})); 
                            if(outputRef?.current?.createUsername && usernameRegex.test(outputRef?.current?.createUsername))
                                setState(p=>({...p,...{reload: !stateRef?.current?.reload, createUsernameFailure: false}}))
                            else
                                setState(p=>({...p,...{reload: !stateRef?.current?.reload, createUsernameFailure: true}}))
                            }
                    }
                />
                <TextInput
                    style={{backgroundColor: '#323232'}}
                    label="Create A Password"
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
                <View style={{marginTop: '0.4%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                {
                    enableAccessCode === true && <TextInput
                        style={{backgroundColor: '#323232'}}
                        label="Enter Access Code"
                        value={outputRef?.current?.createAccessCode !== undefined ? outputRef?.current?.createAccessCode : ''}
                        cursorColor='#ebe8e8'
                        selectionColor='#ebe8e8'
                        mode='outlined'
                        theme={darkTheme}
                        error={stateRef?.current?.accessCodeFailure}
                        secureTextEntry={stateRef?.current?.hidePasswordCreate}
                        right={<TextInput.Icon color="#ebe8e8" icon={stateRef?.current?.eyeCreateIcon} onPress={()=>{
                            setState(p=>({...p,...{
                                hidePasswordCreate: !stateRef?.current?.hidePasswordCreate, 
                                eyeCreateIcon: stateRef?.current?.eyeCreateIcon === "eye-outline" ? "eye-off-outline" : "eye-outline"
                            }}))}}/>}
                        activeUnderlineColor='#ebe8e8'
                        textColor='#ebe8e8'
                        accessibilityLabel={outputRef?.current?.createAccessCode !== undefined ? outputRef?.current?.createAccessCode : ''}
                        onChangeText={text => setOutput(p=>({...p,...{createAccessCode:text}}))}
                    />
                }
                </View> 
                
                <View style={{marginTop: '1%', justifyContent: 'center', alignItems: 'center', width: '65%', maxWidth: 500 }}>
                <Button style={{width: '100%', maxWidth: 500, borderRadius: 4, borderColor: '#ebe8e8'}} onPress={()=>{stateRef?.current?.loadingWheel !== true && loadWheel("Create")}} buttonColor={stateRef?.current?.loadingWheel ? "#343536" : "#323232"} mode='elevated' dark={true}>
                    {stateRef?.current?.loadingWheel === true ? (
                            <ActivityIndicator animating={true} size={20} color="white" />
                        ) : (
                            <Text style={{fontSize: 16, color: "#ebe8e8"}}>
                            Continue
                            </Text>
                        )}
                </Button>
                </View>
                <View style={{marginTop: '2%', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableRipple onPress={()=>{setState(p=>({...p,...{screen: 'Login', eyeCreateIcon: 'eye-outline', hidePasswordCreate: true}})); setOutput(p=>({...p,...{createUsername:'', createPassword:''}}))}}>
                        <Text style={{ color: '#ebe8e8', textDecorationLine: 'underline' }}>Back To Login</Text>
                    </TouchableRipple>
                </View>
                </>
            }}))
        }
        else if (stateRef?.current?.screen === "Forgot") // Forgot Info Page
        {
            if(stateRef?.current?.forgotPhase === 1 || !stateRef?.current?.forgotPhase) // First Page of forgot info
                setState(p=>({...p,...{
                    screenContent: <>
                            <View style={{marginTop: '3%', width: '75%', maxWidth: 500}}>
                        <TextInput
                            style={{backgroundColor: '#323232'}}
                            label={stateRef.current.invalidEmail ? "Enter a Valid Email Address" : "Enter Your Account's Email"}
                            value={outputRef?.current?.email !== undefined ? outputRef?.current?.email : ''}
                            cursorColor='#ebe8e8'
                            selectionColor='#ebe8e8'
                            mode='outlined'
                            theme={darkTheme}
                            error={stateRef.current?.invalidEmail ? stateRef.current?.invalidEmail : false}
                            activeUnderlineColor='#ebe8e8'
                            textColor='#ebe8e8'
                            onChangeText={text => {setOutput(p=>({...p,...{email:text}}))}}
                        />
                        </View> 
                        <View style={{ marginTop: isMobile ? '3%' : '1%', justifyContent: 'center', alignItems: 'center', width: '65%', maxWidth: 500 }}>
                        <Button style={{width: '100%', maxWidth: 500, borderRadius: 4, borderColor: '#ebe8e8'}} buttonColor={stateRef?.current?.loadingWheel ? "#343536" : "#323232"} mode='elevated' onPress={()=>{stateRef?.current?.loadingWheel !== true && loadWheel("Forgot")}} dark={true}>
                            {stateRef?.current?.loadingWheel === true ? (
                                <ActivityIndicator animating={true} size={20} color="white" />
                            ) : (
                                <Text style={{fontSize: 16, color: "#ebe8e8"}}>
                                Continue
                                </Text>
                            )}
                        </Button>
                        </View>
                        <View style={{ marginTop: isMobile ? '7%' : '5%', justifyContent: 'center', alignItems: 'center', width: '65%', maxWidth: 500 }}>
                        <Button style={{width: '100%', maxWidth: 500, borderRadius: 4, borderColor: '#ebe8e8'}} buttonColor={stateRef?.current?.loadingWheel ? "#343536" : "#323232"} mode='elevated' onPress={()=>{setState(p=>({...p,...{forgotPhase: 2}}))}} dark={true}>       
                                <Text style={{fontSize: 16, color: "#ebe8e8"}}>
                                Skip
                                </Text>
                        </Button>
                        </View>
                        <View style={{marginTop: isMobile ? '5%' : '3%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableRipple onPress={()=>{setState(p=>({...p,...{screen: 'Login', invalidEmail: false, forgotPhase: 1}})); setOutput(p=>({...p,...{email:''}}))}}>
                                <Text style={{ color: '#ebe8e8', textDecorationLine: 'underline' }}>Back To Login</Text>
                            </TouchableRipple>
                        </View>
                        </>
                }}))
            else if(stateRef?.current?.forgotPhase === 2) // Second Page of forgot info
            {
                setState(p=>({...p,...{
                    screenContent: <>
                    <View style={{ marginTop: isMobile ? '3%' : '1%', justifyContent: 'center', alignItems: 'center', width: '65%', maxWidth: 500 }}>
                    <Button style={{width: '100%', maxWidth: 500, borderRadius: 4, borderColor: '#ebe8e8'}} buttonColor={stateRef?.current?.loadingWheel ? "#343536" : "#323232"} mode='elevated' onPress={()=>{setState(p=>({...p,...{forgotPhase: 1}}))}} dark={true}>
                                <Text style={{fontSize: 16, color: "#ebe8e8"}}>
                                Back
                                </Text>
                        </Button>
                        </View>
                        <View style={{marginTop: '2%', width: '75%', maxWidth: 500}}>
                        <TextInput
                            style={{backgroundColor: '#323232'}}
                            label={stateRef.current.invalidPin ? "Enter your 6 digit PIN" : "Enter your PIN"}
                            value={outputRef?.current?.pin !== undefined ? outputRef?.current?.pin : ''}
                            cursorColor='#ebe8e8'
                            selectionColor='#ebe8e8'
                            mode='outlined'
                            theme={darkTheme}
                            error={stateRef.current?.invalidPin ? stateRef.current?.invalidPin : false}
                            activeUnderlineColor='#ebe8e8'
                            textColor='#ebe8e8'
                            onChangeText={text => { // Check if PIN is under 6 Digits
                                outputRef?.current?.pin && outputRef?.current?.pin?.length >= 6 && text.length < outputRef?.current?.pin?.length ? setOutput(p=>({...p,...{pin:text}})) :
                                 !outputRef?.current?.pin ? setOutput(p=>({...p,...{pin:text.length > 6 ? text.slice(0,6) : text}})) : 
                                 outputRef?.current?.pin?.length < 6 && setOutput(p=>({...p,...{pin:text.length > 6 ? text.slice(0,6) : text}}))}} 
                        />
                        </View>
                        <View style={{ marginTop: isMobile ? '3%' : '1%', justifyContent: 'center', alignItems: 'center', width: '65%', maxWidth: 500 }}>
                        <Button style={{width: '100%', maxWidth: 500, borderRadius: 4, borderColor: '#ebe8e8'}} buttonColor={stateRef?.current?.loadingWheel ? "#343536" : "#323232"} mode='elevated' 
                        onPress={()=>{
                            outputRef?.current?.pin && outputRef?.current?.pin?.length === 6 // if PIN is right size
                            ? 
                            loadWheel("CheckPin") 
                            : 
                            setState(p=>({...p,...{invalidPin: true}}))}} dark={true}
                            >
                            {stateRef?.current?.loadingWheel === true ? (
                                <ActivityIndicator animating={true} size={20} color="white" />
                            ) : (
                                <Text style={{fontSize: 16, color: "#ebe8e8"}}>
                                Continue
                                </Text>
                            )}
                        </Button>
                        </View>
                        <View style={{marginTop: isMobile ? '5%' : '3%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableRipple onPress={()=>{setState(p=>({...p,...{screen: 'Login', invalidPin: false, forgotPhase: 1, invalidPin: false}})); setOutput(p=>({...p,...{email:'', pin: ''}}))}}>
                                <Text style={{ color: '#ebe8e8', textDecorationLine: 'underline' }}>Back To Login</Text>
                            </TouchableRipple>
                        </View>
                    </>,
                }}))
            }
            else if(stateRef?.current?.forgotPhase === 3) // Second Page of forgot info
            {
                setState(p=>({...p,...{
                    screenContent: <>
                    <View style={{ width: '75%', maxWidth: 550}}>
                     <TextInput
                    style={{backgroundColor: '#323232'}}
                    label="Change Username"
                    value={outputRef?.current?.updateUsername !== undefined ? outputRef?.current?.updateUsername : ''}
                    cursorColor='#ebe8e8'
                    selectionColor='#ebe8e8'
                    mode='outlined'
                    outlineColor={stateRef?.current?.updateUsernameFailure === false && outputRef?.current?.updateUsername ? '#45d645' : null}
                    activeOutlineColor={stateRef?.current?.updateUsernameFailure === false && outputRef?.current?.updateUsername ? '#45d645' : null}
                    theme={darkTheme}
                    error={stateRef?.current?.updateUsernameFailure}
                    activeUnderlineColor='#ebe8e8'
                    textColor='#ebe8e8'
                    onChangeText={text => {
                        setOutput(p=>({...p,...{updateUsername:text}})); 
                            if(outputRef?.current?.updateUsername && usernameRegex.test(outputRef?.current?.updateUsername))
                                setState(p=>({...p,...{reload: !stateRef?.current?.reload, updateUsernameFailure: false}}))
                            else
                                setState(p=>({...p,...{reload: !stateRef?.current?.reload, updateUsernameFailure: true}}))
                            }
                    }
                />
                <TextInput
                    style={{backgroundColor: '#323232'}}
                    label="Change Password"
                    value={outputRef?.current?.updatePassword !== undefined ? outputRef?.current?.updatePassword : ''}
                    cursorColor='#ebe8e8'
                    selectionColor='#ebe8e8'
                    mode='outlined'
                    outlineColor={stateRef?.current?.updatePasswordFailure === false && outputRef?.current?.updatePassword ? '#45d645' : null}
                    activeOutlineColor={stateRef?.current?.updatePasswordFailure === false && outputRef?.current?.updatePassword ? '#45d645' : null}
                    theme={darkTheme}
                    error={stateRef?.current?.updatePasswordFailure}
                    secureTextEntry={stateRef?.current?.hidePasswordCreate}
                    right={<TextInput.Icon color="#ebe8e8" icon={stateRef?.current?.eyeCreateIcon} onPress={()=>{
                        setState(p=>({...p,...{
                            hidePasswordCreate: !stateRef?.current?.hidePasswordCreate, 
                            eyeCreateIcon: stateRef?.current?.eyeCreateIcon === "eye-outline" ? "eye-off-outline" : "eye-outline"
                        }}))}}/>}
                    activeUnderlineColor='#ebe8e8'
                    textColor='#ebe8e8'
                    accessibilityLabel={outputRef?.current?.updatePassword !== undefined ? outputRef?.current?.updatePassword : ''}
                    onChangeText={text => {
                        setOutput(p=>({...p,...{updatePassword:text}}))

                        if(passwordRegex.test(outputRef?.current?.updatePassword)) // make sure password is correct
                        {
                            setState(p=>({...p,...{
                                updatePasswordFailure: false,
                                reload: !stateRef?.current?.reload
                            }}))
                        }
                        else
                        {
                            setState(p=>({...p,...{
                                updatePasswordFailure: true,
                                reload: !stateRef?.current?.reload
                            }}))
                        }
                    
                    }
                }
                />
                <View style={{marginTop: '0.4%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Card mode="outlined" style={{backgroundColor: '#323232', top: 2, width: '90%'}}>
                        <Card.Content>
                            <Text style={{display: 'flex', justifyContent: 'center', color: '#ebe8e8'}}>Password Must Contain:</Text>
                            <View style={{padding: '1%'}}>
                                <Text style={{color: '#ebe8e8', padding: '1%'}}>{`\u2022 8 characters`}</Text>
                                <Text style={{color: '#ebe8e8', padding: '1%'}}>{`\u2022 1 special character (!@$%&*)`}</Text>
                                <Text style={{color: '#ebe8e8', padding: '1%'}}>{`\u2022 1 upper case letter`}</Text>
                                <Text style={{color: '#ebe8e8', padding: '1%'}}>{`\u2022 1 lower case letter`}</Text>
                                <Text style={{color: '#ebe8e8', padding: '1%', display: 'flex', justifyContent: 'center', marginTop: '1%'}}>{`Leave the field blank if you do not want it updated`}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
                        <View style={{ marginTop: isMobile ? '3%' : '1%', display: 'flex', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', alignItems: 'center', width: '65%', maxWidth: 500 }}>
                                <Button style={{width: '100%', maxWidth: 500, borderRadius: 4, borderColor: '#ebe8e8'}} buttonColor={stateRef?.current?.loadingWheel ? "#343536" : "#323232"} mode='elevated' onPress={()=>{
                                    var username, password
                                    if(outputRef?.current?.updateUsername && outputRef?.current?.updateUsername.length > 0) username = outputRef?.current?.updateUsername
                                    if(outputRef?.current?.updatePassword && passwordRegex.test(outputRef?.current?.updatePassword)) password = outputRef?.current?.updatePassword
                                    if(username || password) 
                                        updateLogin(username, password)
                                    }} dark={true}>
                                    {stateRef?.current?.loadingWheel === true ? (
                                        <ActivityIndicator animating={true} size={20} color="white" />
                                    ) : (
                                        <Text style={{fontSize: 16, color: "#ebe8e8"}}>
                                        Continue
                                        </Text>
                                    )}
                                </Button>
                        </View>
                        <View style={{marginTop: isMobile ? '5%' : '3%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableRipple onPress={()=>{setState(p=>({...p,...{screen: 'Login', invalidEmail: false, forgotPhase: 1}})); setOutput(p=>({...p,...{email:''}})); UserMap.size > 0 && setDynamicUserMap({})}}>
                                <Text style={{ color: '#ebe8e8', textDecorationLine: 'underline' }}>Back To Login</Text>
                            </TouchableRipple>
                        </View>
                </View>
                    </>
                }}))
            }
        }
    },[
        stateRef.current.screen, 
        stateRef?.current?.reload, 
        stateRef?.current?.loadingWheel, 
        outputRef?.current, 
        stateRef?.current?.eyeCreateIcon, 
        stateRef?.current?.eyeIcon, 
        stateRef?.current?.invalidEmail, 
        stateRef?.current?.forgotPhase, 
        stateRef?.current?.invalidPin, 
        stateRef?.current?.updatePasswordFailure, 
        stateRef?.current?.updateUsernameFailure
    ])

    useEffect(()=>{
        console.log(UserMap)
    },[UserMap])


    async function checkLoginInfo(){
        await new Promise(() => {
            if(outputRef?.current?.username && outputRef?.current?.password)
            {
                read({action: "Login", database: "Companies", collection: undefined, _id: undefined, query: {username: outputRef?.current?.username, password: outputRef?.current?.password}}, (x)=>{
                    if(x.status === true) // found user
                    {
                        // if(UserMap && UserMap?.size > 0) setUserMap(p => p.delete(p))
                        setDynamicUserMap(x.info)
                        LS_UserMap(x.info)
                        setFailure(false);
                        setState(p=>({...p,...{
                            loadingWheel: false
                        }}))
                        console.log(UserMap)
                        navigation.navigate('MainScreen') // Navigate to home page
                    }
                    else if(x.status === false)
                    {
                        console.log("An error ocurred:", x.info)
                        setState(p=>({...p,...{
                            loadingWheel: false
                        }}))
                        snackbar('error', 'Login Failed: Invalid Username/Password')
                    }
                })
            }
            else 
            {
                setState(p=>({...p,...{loginFailure:true}}))
                setState(p=>({...p,...{
                    loadingWheel: false
                }}))
            }
        })
    }

    async function checkCreateInfo(){
        await new Promise(() => {
            if(usernameRegex.test(outputRef?.current?.createUsername) && passwordRegex.test(outputRef?.current?.createPassword) && ( (enableAccessCode === true && outputRef?.current?.createAccessCode) || (enableAccessCode !== true) ) && usernameRegex.test(outputRef?.current?.createFirstname) && usernameRegex.test(outputRef?.current?.createLastname) && isValidEmail(outputRef?.current?.createEmail))
            {
                // Access Code Enabled
                if(enableAccessCode === true) read({action: "AccessCodeCheck", database: "AccessCodes", collection: undefined, _id: undefined, query: {accessCode: outputRef?.current?.createAccessCode}}, (x) => {
                    console.log(x)
                    if(x.success === true)
                    {
                        console.log(Object.keys(x?.info?.company)?.[0])
                        create({action: "Create", database: "Companies", document:undefined, collection: Object.keys(x?.info?.company)?.[0], data: 
                        {
                            firstName:outputRef?.current?.createFirstname,
                            lastName: outputRef?.current?.createLastname,
                            email: outputRef?.current?.createEmail,
                            level: 10,
                            username: outputRef?.current?.createUsername,
                            password: outputRef?.current?.createPassword,
                            company: Object.keys(x?.info?.company)?.[0],
                            accessCode: outputRef?.current?.createAccessCode,
                        }
                    },(x)=>{
                        if(x?.success === true)
                        {
                            setState(p=>({...p,...{
                                loadingWheel: false,
                                screen: 'Login',
                            }}))
                        }
                        else if(x?.success === false && x?.info === "Duplicate")
                        {
                            setState(p=>({...p,...{
                                loadingWheel: false,
                                SnackbarContent: <Text style={{color: '#373837', fontWeight: 'bold'}}>This Username is a duplicate. Please choose another.</Text>,
                            }}))
                            onToggleSnackBar() // enable Snackbar
                        }
                    })
                    }
                    else
                    {
                        setState(p=>({...p,...{accessCodeFailure:true}}))
                        setState(p=>({...p,...{
                            loadingWheel: false,
                        }}))
                    }
                })
                // Access Code Disabled
                else 
                    create({action: "Create", database: "Companies", document:undefined, collection: Object.keys(x?.info?.company)?.[0], data: 
                    {
                        firstName:outputRef?.current?.createFirstname,
                        lastName: outputRef?.current?.createLastname,
                        email: outputRef?.current?.createEmail,
                        level: 10,
                        username: outputRef?.current?.createUsername,
                        password: outputRef?.current?.createPassword,
                        company: Object.keys(x?.info?.company)?.[0],
                    }
                },(x)=>{
                    if(x?.success === true)
                    {
                        setState(p=>({...p,...{
                            loadingWheel: false,
                            screen: 'Login',
                        }}))
                    }
                    else if(x?.success === false && x?.info === "Duplicate")
                    {
                        setState(p=>({...p,...{
                            loadingWheel: false,
                            SnackbarContent: <Text style={{color: '#373837', fontWeight: 'bold'}}>This Username is a duplicate. Please choose another.</Text>,
                        }}))
                        onToggleSnackBar() // enable Snackbar
                    }
                })
                
            }
            else 
            {
                // set errors for text input boxes
                if(!outputRef?.current?.createUsername || !usernameRegex.test(outputRef?.current?.createUsername)) setState(p=>({...p,...{createUsernameFailure:true}}))
                if(!outputRef?.current?.createPassword || !passwordRegex.test(outputRef?.current?.createPassword)) setState(p=>({...p,...{createPasswordFailure:true}}))
                if(!outputRef?.current?.createFirstname || !usernameRegex.test(outputRef?.current?.createFirstname)) setState(p=>({...p,...{createFirstnameFailure:true}}))
                if(!outputRef?.current?.createLastname || !usernameRegex.test(outputRef?.current?.createLastname)) setState(p=>({...p,...{createLastnameFailure:true}}))
                if(!outputRef?.current?.createEmail || !isValidEmail(outputRef?.current?.createEmail)) setState(p=>({...p,...{createEmailFailure:true}}))
                if(!outputRef?.current?.createAccessCode) setState(p=>({...p,...{accessCodeFailure:true}}))

                setState(p=>({...p,...{
                    loadingWheel: false
                }}))
            }
        })
    }

    async function checkForgotInfo(){
        if(outputRef?.current?.email && isValidEmail(outputRef?.current?.email))
        {
            socketIO?.emit('userForgot', {link: outputRef?.current?.email}, (x)=>{
                if(x.success === true)
                {
                    setState(p=>({...p,...{
                        loadingWheel: false,
                        SnackbarContent: <Text style={{color: '#373837', fontWeight: 'bold'}}>Recovery Email Sent</Text>,
                        forgotPhase: 2
                    }}))
                    onToggleSnackBar() // enable Snackbar
                }
            })
        }
    }

    async function checkPin(){
        if(outputRef?.current?.pin && outputRef?.current?.pin?.length === 6) // Safety Check
        {
            socketIO?.emit('queryDB', {database: 'Recovery', collection: 'Pins', query: {pin: outputRef?.current?.pin}, filter: {}}, (x)=>{
                if(x.success === true)
                {
                    console.log(x)
                    setState(p=>({...p,...{
                        loadingWheel: false,
                        forgotPhase: 3
                    }}))
                    console.log(x?.info?.UserID)
                    socketIO?.emit('queryDB', {database: 'Companies', collection: null, query: {_id: x?.info?.UserID}, filter: {}}, (val)=>{
                        if(val.success === true)
                        setDynamicUserMap(val.info)
                        LS_UserMap(val.info)
                    })
                }
            })
        }
    }

    function updateLogin(username, password){
        if(username || password)
        {
            var data = {}
            if(username) data.username = username
            if(password) data.password = password
            update({database: "Companies", collection: null, query:{'_id': UserMap.get('_id')}, data:{$set: data}}, (x)=>{
                setState(p=>({...p,...{screen: 'Login', invalidPin: false, forgotPhase: 1, invalidPin: false}}))
            })
        }
    }

    useEffect(()=>{
        if(visible === true){
            setTimeout(()=>{
                setVisible(false)
            },9000)
        }
    },[visible])

    useEffect(()=>{
        if(username && password)
        {
            setState(p=>({...p,
                loginButton: <PaperButton onPress={checkLoginInfo} icon={"login"} label={"Login"} 
                                          mode={'elevated'} dark={false} compact={false} buttonColor={"#ADD8E6"} 
                                          textColor={"black"} rippleColor={"#34ebde"} loading={loadingLogin} 
                                          disabled={false} uppercase={false} accessibilityLabel={"Clicked"}
                                          style={{margin:'auto', backgroundColor: "#FFF"}}
                             >
                                Login
                             </PaperButton>
            }))
        }
    },[username, password, loadingLogin])

    return <View style={{flex: 1, overflow: 'hidden', alignItems: 'center' }}><ImageBackground source={require("../img/3.png")} resizeMode="stretch" style={{width:windowDimensions?.width, height:windowDimensions?.height, alignItems:'center', justifyContent: 'center'}}>
       <Avatar.Image size={114} style={{marginTop: isMobile && stateRef?.current?.screen === "Create" ? '15%' : '10%',  backgroundColor: 'rgba(0, 0, 0, 0)', }} source={require('../img/Designer.png')}/>
       <Text style={{color: 'white', fontSize: 30, fontFamily: 'Kanit-Light'}}>Your Name Here</Text>
       <ScrollView style={{width: '100%'}} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
       {stateRef?.current?.screenContent}
       </ScrollView>
        </ImageBackground> 
        <Snackbar
            style ={{backgroundColor: '#f2f5f3', color: '#373837'}}
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
            label: <Text style={{color: '#373837', fontWeight: 'bold'}}>Close</Text>,
            onPress: () => {
                setVisible(false)
            },
            }}>
            {stateRef?.current?.SnackbarContent}
        </Snackbar>
        </View>
}

export default Login;