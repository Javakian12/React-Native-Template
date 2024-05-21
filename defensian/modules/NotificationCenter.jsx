import React, { Component, useEffect, useRef, forwardRef } from 'react';
import { Avatar, Button, Card, Drawer, IconButton, Icon, Text, TextInput, BottomNavigation, Divider, Searchbar, DefaultTheme, DataTable } from 'react-native-paper';
import { TouchableWithoutFeedback as RNTouchableWithoutFeedback } from 'react-native';

import { useAtom } from 'jotai'

import { CommunityIcon } from 'react-native-paper';

import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

import useState from 'react-usestateref';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { storage } from '../App';

import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
 import { Entypo } from "@expo/vector-icons";

const NotificationCenter =({navigation, route})=> {
  const {globalState, read, create, update, deleteVal, isMobile, setDynamicMap, setDynamicUserMap, Stack, LS_UserMap, Get_LC_UserMap, snackbar, popup} = route.params  // get props from stack navigator (global state)

  const [searchQuery, setSearchQuery] = useState('');
  const [UserMap, setUserMap] = useAtom(globalState.userMapState)

  const [UserObj, setUserObj] = useAtom(globalState.userObjState)
  const mainState = useState(Object);
  const [,setState, stateRef] = mainState;
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [windowDimensions, ] = useAtom(globalState.windowSize);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  // Socketio stuff
  const [socketState, setSocketState] = useAtom(globalState.socketState)
  if(socketState.size > 0) var socketIO = socketState.get('socketIO')

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, UserMap.get('notifications')?.length);

  // Define a custom dark theme by extending the DefaultTheme
  const customDarkTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      // Customize other colors if needed
    },
  };

  // Delete the selected notification
  const deleteNotification = (_id) => {

    deleteVal({database:"Companies", collection:UserMap.get('company'), query:{'_id': UserMap.get('_id')}, field: {'_id':_id}, action: "array", type: "notifications"},({success,err,info})=>{
      if(success === true)
      {
        snackbar('success', 'Successfully deleted notification');
        setDynamicUserMap(info); // Update User Map
      }
      else if (success === false)
      {
        console.log("err was:", err)
        snackbar('error', 'There was a problem while deleting the notification')
      }      
    })
  }

  // Determine if data needs to be updated
  function compareMapAndObject(map, obj) {
    // Check if the number of keys is the same
    if (map.size !== Object.keys(obj).length) {
      return false;
    }
  
    // Check if all keys in the map exist in the object
    for (const key of map.keys()) {
      if (!obj.hasOwnProperty(key)) {
        return false;
      }
    }
  
    // Check if all values in the map are equal to the corresponding values in the object
    for (const [key, value] of map.entries()) {
      if (obj[key] !== value) {
        return false;
      }
    }
  
    return true;
  }

  useEffect(()=>{
    if(socketIO?.connected === true)
      read({database:"Companies", collection:UserMap.get('company'), _id: UserMap.get('_id'), query:{'_id': UserMap.get('_id')}},({success,info,err})=>{
        if(success === true && !compareMapAndObject(UserMap, info)) {
          setDynamicUserMap(info);
          LS_UserMap();
        }
        else if(success === false) {
          console.log("error while finding notifications:", err)
          snackbar('error', 'Could not find notifications')
        }
      })
  },[socketIO?.connected])

  const buildNotifications = () => {
    const notifications = UserMap.get('notifications');

    if(isMobile) {
      setState(p=>({...p,
        notificationsPage: notifications && notifications.length > 0 ? notifications.flatMap((x,i)=>{
          return <View key={"notificationViewCard_"+i} style={styles.cardView}>
            <Card style={styles.notificationCard} key={"notificationCard_"+i} elevation={2}>
            <Card.Title
              title={x?.title}
            />
            <Card.Content>
              <Text>{x?.body}</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="outlined" icon="trash-can-outline" buttonColor='#FFA8A8' textColor='black' onPress={()=>deleteNotification(x._id)}>Delete</Button>
            </Card.Actions>
          </Card>
          </View>
        }) : <View key={"notificationViewCard_"} style={styles.cardView}/>
      }))
    }
    else
      setState(p=>({...p,
        notificationsPage: <View style={styles.gridBox}>
          <View style={styles.topNotificationBar}>
            <Text style={styles.notificationText}>Notifications</Text>
            <Avatar.Text style={{backgroundColor: '#FFD700'}} labelStyle={{fontSize: 20}} color='black' size={30} label={notifications?.length} />
          </View>
          {
            notifications?.flatMap((x,i)=>{
             // console.log(stateRef?.current, x?._id)
              return <Card key={'NotificationCard_'+i} style={styles.gridCard}>
                  <Card.Content>
                    <View style={styles.gridCardContent}>
                      
                      <Text style={styles.cardText}>{x?.title}</Text>
                      <Menu style={{borderRadius: 5}}>
                        <MenuTrigger>
                        <Entypo name="dots-three-vertical" size={18} color="white" />
                        </MenuTrigger>
                        <MenuOptions customStyles={{optionsContainer: {borderRadius: 10, backgroundColor: '#8b8c8b'}}}>
                          <MenuOption>
                          <Button style={{marginBottom: 5}} icon="eye" dark={true} textColor='white' onPress={()=>console.log("Test")}>
                            View
                          </Button>
                          <Divider/>
                          <Button style={{marginTop: 5}} icon="trash-can-outline" dark={true} textColor='white' onPress={()=>deleteNotification(x._id)}>
                            Delete
                          </Button>
                          </MenuOption>
                        </MenuOptions>
                      </Menu>
                    </View>
                  </Card.Content>
                </Card>
            })
          }
          <View style={{maxHeight: '100%', overflow: 'hidden'}}>
            <Divider style={{marginTop: '1%'}} horizontalInset={true} />
            <Text style={styles.bottomText}>Looks like that's it!</Text>
          </View>
        </View>
      }))
  }

  const templateNotification = {
    _id: "templateNotification",
    title: "No New Notifications",
    icon: "bell-check-outline",
    type: "template"
  }

  const viewNotification = (notif) => {
    popup({title: notif?.title, description: notif?.body, popupStyle: {width: '50%', height: '50%' }, inputField: <View style={styles.popupImage}><Image style={{width: 400, height: 400, resizeMode: 'stretch'}}source={{uri: notif?.image}}/></View>})
 }

  useEffect(()=>{
    if(!stateRef?.current?.selectedNotification) setState(p=>({...p,selectedNotification: UserMap.get('notifications')?.[0] ? UserMap.get('notifications')?.[0] : templateNotification}))

    const notif = stateRef?.current?.selectedNotification;

    setState(p=>({...p,
      advancedView: <View style={{width: '50%'}}>
          <Card style={{backgroundColor: "#222222", height: '100%'}}>
            <Card.Title titleVariant='displaySmall' titleStyle={{color: 'rgba(242, 242, 242,0.9)'}} subtitleStyle={{color: 'rgba(242, 242, 242,0.9)'}} subtitle={notif?.type ? notif?.type === "template" ? "You have 0 notifications" : `You have a new ${notif?.type}` : "You have a new notification"} title={notif?.title} left={(props)=> <Avatar.Icon {...props} style={{backgroundColor:'#7c7d7d'}} icon={notif?.icon ? notif?.icon : "alert-circle"}/>}/>
            {notif?.image && <Card.Cover style={{padding: '1%', backgroundColor: "#222222"}} source={{uri: notif?.image}} />}
            <Card.Content style={{paddingTop: '2%'}}><Text style={{color: 'rgba(242, 242, 242,0.7)'}}>{notif?.body}</Text></Card.Content>
            <Card.Actions>
              <Button buttonColor='rgb(55, 132, 137)' textColor="rgba(242, 242, 242,0.9)" onPress={()=>viewNotification(notif)}>
                View
              </Button>
              <Button buttonColor='rgb(241, 204, 65)' textColor='#4e3700' onPress={()=>selectNotification(notif?._id)}>
                <Text style={{color: '#4e3700', fontWeight: 'bold'}}>Dismiss</Text>
              </Button>
            </Card.Actions>
          </Card>
      </View>
    }))
  },[stateRef?.current?.selectedNotification])

  /*
 <Menu
                      style={{width: '50%', height: '50%', backgroundColor: 'grey', zIndex: 20, }}
                      anchor={ <IconButton icon="dots-vertical" onPress={()=>{setState(p=>({...p,menuOpen:{[x?._id]:stateRef?.current?.[x?._id] ? !stateRef?.current?.[x?._id] : true}}))}}/>}
                      visible={stateRef?.current?.menuOpen?.[x?._id]}
                      onDismiss={()=>dismissMenu(x?._id)}
                    >
                      <Menu.Item title="Test" />
                    </Menu>
  */

    useEffect(()=>{
      if(UserMap) {
        buildNotifications();
      }
    },[UserMap, stateRef?.current?.menuOpen])

    const dismissMenu=(_id)=>{

      setState(p=>({...p,menuOpen:{[_id]:stateRef?.current?.[_id] ? !stateRef?.current?.[_id] : false}}))
    }

    const selectNotification=(_id)=>{
      setState(p=>({...p,selectedNotification: UserMap.get('notifications').filter(x=>x?._id===_id)?.[0]}));

      update({database: "Companies", collection: UserMap.get('company'), query:{'_id': UserMap.get('_id')}, data:{$set: {'notifications.$[element].read': true}}, arrayFilter: {   'element._id':  _id  }, authorizationToken: UserMap.get('secretToken'), returnVal: true}, (x)=>{
        if(x.success === false) console.log("An error occurred:", x.info)
        else if(x.success === true && x.info?._id) {
          setDynamicUserMap(x.info)
    }});
    }

    // Notification StyleSheets ---------------------------------------
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            //backgroundColor: '#15202B',
            borderRadius: 5,
            padding: '1%'
        },
        containerCard: {
         // backgroundColor: '#15202B',
          borderRadius: 5,
         // padding: '0.5%',
          flexDirection: windowDimensions.width >= 500 ? 'row' : null, // Display cards side by side
          flexWrap: 'wrap', // Allow cards to wrap to the next line
          justifyContent: 'space-between', // Distribute space between cards
        },
        cardView: {
            flex: 1,
            width: '100%',
            padding: '1%'
            //paddingTop: '0.5%',
        },
        notificationCard: {
            width: '100%',
            overflow: 'hidden'
        },
        searchBar: {
            zIndex: 10,
            paddingBottom: '0.5%'
        },
        popupImage: {
          display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '1%', paddingTop: '2%'
        },
        gridBox: {
          //backgroundColor: '#15202B',
          width: '100%',
          height: '100%',
          borderRadius: 5,
         // paddingTop: '1%',
          //paddingBottom: '1%',
         // marginTop: '1%',
          height: '100%',
          zIndex: 5
        },
        gridCard: {
          margin: 4,  
        },
        gridCardContent: {
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
        },
        cardText: {
          display: 'flex',
          alignItems: 'center',
          color: '#fcfcfc',
          fontFamily: 'System',
          fontSize: isMobile?24:17,
        },
        notificationText: {
          color: 'white',
          padding: '1%',
          fontSize: 25,
          fontFamily: 'System'
        },
        topNotificationBar: {
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: '1%'
        },
        bottomText: {
          display: 'flex',
          justifyContent: 'center',
          color: 'white',
          marginTop: '1%',
          fontSize: isMobile?24:17,
        },
        mainBox: {
          display: 'flex',
          flexWrap: 'nowrap',
          flexDirection: 'row',
          flex: 1,
        }
      });
      // End of Notification StyleSheets --------------------------------

      // rgba(107,107,105,0.9)

    return <View style={{flex: 1}}>
        <View style={styles.mainBox}>
          {windowDimensions.width > 500 && stateRef?.current?.advancedView}
          <View style={{width: windowDimensions.width > 500 ? '50%' : '100%'}}>
          <FlatList data={UserMap?.get('notifications')} renderItem={({item}) =>
            <View style={styles.containerCard}>
            <TouchableOpacity style={styles.gridBox} onPress={()=>selectNotification(item?._id)}>
                  
                  <Card key={'NotificationCard_'+item?._id} mode='contained' style={{...styles.gridCard, backgroundColor: (!item?.read || item?.read === false) ? '#404040' : '#222222', elevation:5, shadowColor: '#f5f05d', shadowOffset: {width: item?.read === true ? 0 : -4, height: 0}}}>
                          <Card.Content>
                            <View style={styles.gridCardContent}>
                              
                              <Text style={styles.cardText}>{item?.title}</Text>
                              <Menu style={{borderRadius: 5}}>
                                <MenuTrigger>
                                <Entypo name="dots-three-vertical" size={18} color="white" />
                                </MenuTrigger>
                                <MenuOptions customStyles={{optionsContainer: {borderRadius: 10, backgroundColor: '#2d2d2d'}}}>
                                  <MenuOption>
                                  <Button style={{marginBottom: 5}} icon="eye" dark={true} textColor='white' onPress={()=>console.log("Test")}>
                                    View
                                  </Button>
                                  <Divider/>
                                  <Button style={{marginTop: 5, zIndex: 6}} icon="trash-can-outline" dark={true} textColor='white' onPress={()=>deleteNotification(item._id)}>
                                    Delete
                                  </Button>
                                  </MenuOption>
                                </MenuOptions>
                              </Menu>
                            </View>
                          </Card.Content>
                        </Card>
                </TouchableOpacity>
            </View>} 
            keyExtractor={item => item?._id}
            style={styles.container}>
          </FlatList>
          </View>
        </View>
          </View>
    
}

export default NotificationCenter;


/* Old Code (DataTable):

<DataTable>
          <DataTable.Header>
            <DataTable.Title>Location</DataTable.Title>
            <DataTable.Title>Importance</DataTable.Title>
            <DataTable.Title>Notes</DataTable.Title>
            </DataTable.Header>
            {notifications?.map((item) => {
              return (
                  <DataTable.Row key={"datatable_row_"+item?._id}>
                  <DataTable.Cell>
                    {item?.title}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {item?.priority}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {item?.body}
                  </DataTable.Cell>
                </DataTable.Row>
              )
            })}
             <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(UserMap.get('notifications')?.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${UserMap.get('notifications')?.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
        </DataTable>
         <View style={{maxHeight: '100%', overflow: 'hidden'}}>
            <Divider style={{marginTop: '1%'}} horizontalInset={true} />
            <Text style={styles.bottomText}>Looks like that's it!</Text>
          </View>

*/