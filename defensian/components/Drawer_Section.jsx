import * as React from 'react';
import {useEffect} from 'react';
import { Drawer } from 'react-native-paper';
import useState from 'react-usestateref';

/*
Items should look like:
Items: [{
          label: String,
          icon: IconSource,
          style: String,
          onPress: Function,
          active: Boolean,
          rippleColor: String,
          accessibilityLabel: String,
          right: (props: { color: string }) => React.ReactNode,
          theme: ThemeProp,
        }]
*/

const Drawer_Section = ({Title, Items, style, initialActive}) => {
  const [active, setActive] = useState(initialActive ? initialActive : 'first');
  const mainState = useState(Object);
  const [,setState, stateRef] = mainState;

  const activateItem=(funct, index)=>{
    setActive(index);
    funct();
  }


  return <Drawer.Section title={Title&&Title} style={style&&style}> 
        {stateRef.current.DrawerItems}
        { 
        Items?.length > 0 && Items?.flatMap((v,i)=>{
              return(
             <Drawer.Item
                key={i+1}
                label={v?.label&&v?.label}
                Icon={v?.icon&&v?.icon}
                style={v?.style&&v?.style}
                onPress={()=>activateItem(v?.onPress, v?.active)}
                active={active === v?.active}
                rippleColor={v?.rippleColor&&v?.rippleColor}
                accessibilityLabel={v?.accessibilityLabel&&v?.accessibilityLabel}
                right={v?.right&&v?.right}
                theme={v?.theme&&v?.theme}
            />
              );
        })}
    </Drawer.Section>
};

export default Drawer_Section;