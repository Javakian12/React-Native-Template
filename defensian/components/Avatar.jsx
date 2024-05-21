import * as React from 'react';
import { Avatar } from 'react-native-paper';

const PaperAvatar = ({

    source, size, style, onError, onLayout, onLoad, onLoadEnd, onLoadStart, onProgress, theme

}) => {


 return <Avatar.Image source={source&&source} size={size&&size} style={style&&style} 
 onError={onError&&onError} onLayout={onLayout&&onLayout} onLoad={onLoad&&onLoad} 
 onLoadEnd={onLoadEnd&&onLoadEnd} onLoadStart={onLoadStart&&onLoadStart}
 onProgress={onProgress&&onProgress} theme={theme&&theme} />
 
};


export default PaperAvatar