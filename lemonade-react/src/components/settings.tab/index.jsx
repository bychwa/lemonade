import React from 'react';
import { Segment } from 'semantic-ui-react';

export default class SettingsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    handleItemClick(e, data) {
    }
    render() {
        return (
            <Segment>
                settings here
            </Segment>
        );
    }
}