import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    ImageBackground,
    Dimensions 
  } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';

// Navigation takes in a object with key, title, focused icon, and unfocused icon
// SceneMapFunctions takes an array of functions

const PaperBottomNavigation = ({

  navigation, SceneMapFunctions, shifting, labeled, compact, activeColor, 
  inactiveColor, sceneAnimationEnabled, sceneAnimationType, keyboardHidesNavigationBar, 
  safeAreaInsets, barStyle, labelMaxFontSizeMultiplier, style, theme, testID

}) => {

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState(navigation) 
  var tempObjKeys = {}
  var renderScene

  tempObjKeys?.length > 0 ? renderScene = BottomNavigation.SceneMap(tempObjKeys) : renderScene = null

  const renderSceneInit=()=>{ // Set bottom navigation states (functions)
    SceneMapFunctions.forEach((v,i)=>{
        if(navigation?.[i]?.key) // check if key exists
        {
            var tempKey = navigation?.[i]?.key // temp store key
            tempObjKeys[tempKey] = v // assign function to key
        } 
    })
    // Store Functions
    console.log(tempObjKeys[0])
      BottomNavigation.SceneMap(
        tempObjKeys
      );
  }

  //const renderScene = BottomNavigation.SceneMap(tempObjKeys);

  return (
    <BottomNavigation
      key={navigation.length}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={shifting&&shifting}
      labeled={labeled&&labeled}
      compact={compact&&compact}
      activeColor={activeColor&&activeColor}
      inactiveColor={inactiveColor&&inactiveColor}
      sceneAnimationEnabled={sceneAnimationEnabled&&sceneAnimationEnabled}
      sceneAnimationType={sceneAnimationType&&sceneAnimationType}
      keyboardHidesNavigationBar={keyboardHidesNavigationBar&&keyboardHidesNavigationBar}
      safeAreaInsets={safeAreaInsets&&safeAreaInsets}
      barStyle={barStyle&&barStyle}
      labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier&&labelMaxFontSizeMultiplier}
      style={style&&style}
      theme={theme&&theme}
      testID={testID&&testID}
    />
  );
};

export default PaperBottomNavigation;