import React from 'react';
import { Container, Header, Divider, Input, Button } from 'semantic-ui-react';

export default class MfaAuth extends React.Component {
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
            <Container padded='true' className='App'>
                <Container className='mfa-container'>
                    <Header content='Mfa Auth!' as='h2' />
                    <Divider />
                    <Input fluid size='huge' style={{ fontSize: '150%', textAlign: 'center' }} />
                    <Divider />
                    <Button primary size='huge' content='Submit' fluid />
                    <Divider />
                </Container>
            </Container>
        );
    }
}