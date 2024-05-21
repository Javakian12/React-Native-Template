import * as React from 'react';
import { Button } from 'react-native-paper';

const PaperButton = (

    {onPress, icon, label, mode, dark, compact, buttonColor, textColor, rippleColor, loading, disabled, uppercase, accessibilityLabel, accessibilityHint, onPressIn, onPressOut, onLongPress, delayLongPress, contentStyle, style, labelStyle, theme, testID}
    
    ) => {
    // mode must be a '' not a "" !!!!!!!!!!!!!!!!
    return <Button icon={icon&&icon} mode={mode?mode:'text'} onPress={onPress&&onPress} 
                   dark={dark&&dark} compact={compact&&compact} buttonColor={buttonColor&&buttonColor} 
                   textColor={textColor&&textColor} rippleColor={rippleColor&&rippleColor} loading={loading&&loading}
                   disabled={disabled&&disabled} uppercase={uppercase&&uppercase} accessibilityLabel={accessibilityLabel&&accessibilityLabel}
                   accessibilityHint={accessibilityHint&&accessibilityHint} onPressIn={onPressIn&&onPressIn} onPressOut={onPressOut&&onPressOut}
                   onLongPress={onLongPress&&onLongPress} delayLongPress={delayLongPress&&delayLongPress} contentStyle={contentStyle&&contentStyle}
                   style={style&&style} labelStyle={labelStyle&&labelStyle} theme={theme&&theme} testID={testID&&testID}
            >
        {label&&label}
  </Button>
};

export default PaperButton;