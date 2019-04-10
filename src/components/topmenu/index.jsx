import React from 'react';
import {Menu} from 'semantic-ui-react';

export default class TopMenu extends React.Component{
    render(){
        const activeItem = this.props.activeItem;
        return (
            <Menu widths={2} pointing={true}>
            {
              this.props.menuItems.map(item => (
                <Menu.Item
                  key={item}
                  name={item}
                  active={activeItem === item}
                  onClick={(e, data) => this.props.onChange(e, data)}
                />
              ))
            }
          </Menu>
        );
    }
}