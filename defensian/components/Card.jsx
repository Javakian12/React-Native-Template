import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import {
    SafeAreaView
  } from 'react-native';

const PaperCard = ({

    mode, children, onLongPress, onPress, onPressIn, onPressOut, delayLongPress, 
    disabled, elevation, contentStyle, style, theme, testID, accessible, leftIcon, button1Text, button2Text,
    button1Action, button2Action, cardTitle, cardContent, cardTextTitle, cardTextContent, cardCoverImage, cardContentItems

}) => {

    useEffect(()=>{
        if(!Array.isArray(cardContentItems)) console.error(`"cardContentItems" must be a type array`)
    },[])

    const LeftContent = props => <Avatar.Icon {...props} icon={leftIcon} />

    return <Card style={style&&style}>
                <Card.Title title={cardTitle&&cardTitle} subtitle={cardContent&&cardContent} left={LeftContent} />
                <Card.Content>
                <Text variant="titleLarge">{cardTextTitle&&cardTextTitle}</Text>
                <Text variant="bodyMedium">{cardTextContent&&cardTextContent}</Text>
                {cardContentItems&&cardContentItems.length > 1 ? cardContentItems.flatMap((x,i)=>{return <SafeAreaView key={i}>{x}</SafeAreaView>}) : <SafeAreaView key={0+"test"}>{cardContentItems[0]}</SafeAreaView>}
                </Card.Content>
                {cardCoverImage&&
                <Card.Cover source={cardCoverImage} />}
                <Card.Actions>
                { button1Text &&
                <Button onPress={button1Action}>{button1Text}</Button> }
                { button2Text &&
                <Button onPress={button2Action}>{button2Text}</Button> }
                </Card.Actions>
           </Card>
};

export default PaperCard;