import * as React from 'react';
import { IconButton } from 'react-native-paper';

const PaperIconButton = ({icon,mode,iconColor,containerColor,rippleColor,selected,size,disabled,animated,accessibilityLabel,onPress,style,ref,testID,theme}) => {
  return <IconButton
    icon={icon&&icon}
    iconColor={iconColor&&iconColor} size={size&&size}
    mode={mode?mode:'outlined'} onPress={onPress&&onPress} animated={animated&&animated}
    containerColor={containerColor&&containerColor} rippleColor={rippleColor&&rippleColor}
    disabled={disabled&&disabled} accessibilityLabel={accessibilityLabel&&accessibilityLabel} selected={selected&&selected}
    style={style&&style} theme={theme&&theme} testID={testID&&testID} ref={ref&&ref}
  />
};

export default PaperIconButton;