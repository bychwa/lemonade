import React from 'react';
import { Container, Header, Divider, Form, Button } from 'semantic-ui-react';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mfa: false,
            aws_default_region: '',
            aws_access_key_id: '',
            aws_secret_access_key: '',
            mfa_serial: ''
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.onToogleMfa = this.onToogleMfa.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    onToogleMfa(e, data){
        this.setState({
            mfa: data.checked
        });
    }
    handleOnChange(e, data) {
        this.setState({
            [data.name]: data.value
        });
    }
    handleItemClick(e, data) {
    }
    render() {
        const regionOptions = [
            { text: 'EU West 1 (Ireland)', value: 'eu-west-1', description: 'Europe' },
            { text: 'EU Central 1 (Frankfurt)', value: 'eu-central-1', description: 'Europe' }
        ];
        return (
            <Container padded='true' className='App'>
                <Container className='signup-container' >
                    <Header content='Root Account Signup' as='h2' />
                    <Divider />
                    <Form style={{ textAlign: 'left' }}>
                        <Form.Select label='AWS_DEFAULT_REGION' value={this.state.aws_default_region} name='aws_default_region' onChange={this.handleOnChange} options={regionOptions} fluid size='huge' style={{ fontSize: '150%' }} />
                        <Form.Input label='AWS_ACCESS_KEY_ID' value={this.state.aws_access_key_id} name='aws_access_key_id'  onChange={this.handleOnChange} placeholder='XX' fluid size='huge' style={{ fontSize: '150%' }} />
                        <Form.Input label='AWS_SECRET_ACCESS_KEY' value={this.state.aws_secret_access_key} name='aws_secret_access_key' onChange={this.handleOnChange} placeholder='YY' fluid size='huge' style={{ fontSize: '150%' }} />
                        <Form.Field>
                            <Form.Checkbox checked={this.state.mfa} toggle onChange={this.onToogleMfa} label='Has MFA activated' />
                        </Form.Field>
                        {
                            this.state.mfa && 
                            <Form.Input label='MFA_SERIAL' placeholder='YY' value={this.state.mfa_serial} name='mfa_serial' onChange={this.handleOnChange} fluid size='huge' style={{ fontSize: '150%' }} />
                        }
                    </Form>
                    <Divider />
                    <Button primary size='huge'  content='Submit' fluid />
                    <Divider />
                </Container>
            </Container>
        );
    }
}