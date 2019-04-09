import React from 'react';
import { Segment, Message, Icon } from 'semantic-ui-react';

export default class ProfilesTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeProfile: 'offline'
        };
        this.onChangeProfile = this.onChangeProfile.bind(this);
    }
    onChangeProfile(profile) {
        this.setState({
            activeProfile: profile
        })
    }
    render() {
        const profiles = [
            { name: 'offline',  color: 'red' },
            { name: 'dev',  color: 'green' },
            { name: 'stage',  color: 'green' },
            { name: 'prod', color: 'green' }
        ]
        return (
            <Segment>
                {
                    profiles.map(profile => (
                        <Message style={{cursor: 'pointer'}} key={profile.name} onClick={() => this.onChangeProfile(profile.name)} icon color={profile.name === this.state.activeProfile  ? profile.color: ''}>
                            <Icon name={`square ${profile.name === this.state.activeProfile ? '' : 'outline'}`} />
                            <Message.Content>
                                <Message.Header style={{ textAlign: 'left' }}>{profile.name}</Message.Header>
                            </Message.Content>
                        </Message>
                    ))
                }
            </Segment>
        );
    }
}