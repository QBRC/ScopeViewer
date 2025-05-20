import { Component } from 'react';
import { FixedSizeList as List } from "react-window";

class MenuList extends Component {
    render(){
  

    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const height = 45;
    const initialOffset = options.indexOf(value) * height;
    
    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
    }
}

export default MenuList;