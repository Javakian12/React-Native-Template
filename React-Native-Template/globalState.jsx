import { atom } from 'jotai'

import { Dimensions } from 'react-native'

export const socketState = atom(new Map())

export const userMapState = atom(new Map())

export const userObjState = atom({})

export const screenID = atom(new Map())

export const windowSize = atom(Dimensions.get('window'))

//export const notificationMapState = atom(new Map())