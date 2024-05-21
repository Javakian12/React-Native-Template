import * as React from 'react';
import { Image } from 'react-native';
import { Banner } from 'react-native-paper';
import useState from 'react-usestateref';

const PaperBanner = ({

    visible,text,children,icon,actions,contentStyle,elevation,style,ref,theme,onShowAnimationFinished,onHideAnimationFinished

}) => {

  return (
    <Banner
      visible={visible}
      actions={actions}
      icon={({size}) => (
        <Image
          source={{
            uri: 'https://smallimg.pngkey.com/png/small/51-512118_message-icon-message-icon-png-black.png',
          }}
          style={{
            width: size,
            height: size,
          }}
        />
      )}>
      {text&&text}
    </Banner>
  );
};

export default PaperBanner;