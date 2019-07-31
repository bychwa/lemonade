import React from 'react';
import { Container, Header, Divider, Select, Button, Form } from 'semantic-ui-react';

export default class ChooseAuth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: '',
            type: ''
        };
        this.handleItemClick = this.handleItemClick.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
    }
    handleItemClick(e, data) {
    }
    onChangeInput(e, data){
        this.setState({
            [data.name]: data.value
        })
    }
    render() {
        const authModes = [
            { key: 'root', text: 'Root', value: 'root' },
            { key: 'federated', text: 'Federated', value: 'federated' }
          ]
          const authType = [
            { key: 'adfs', text: 'ADFS', value: 'adfs' },
            { key: 'facebook', text: 'Facebook', value: 'facebook' }
          ]
          const {
            mode, type
          } =  this.state;
        return (
            <Container padded='true' className='App'>
                <Container>
                    <Header content='Add Account Profiles' as='h2' />
                    <Divider />
                    <div>
                    <Form.Field
                        name='mode'
                        value={mode}
                        onChange={this.onChangeInput}
                        fluid={true}
                        control={Select}
                        options={authModes}
                        label={<Header content='account mode'/>}
                    /> <br/>
                    <Form.Field
                        name='type'
                        value={type}
                        onChange={this.onChangeInput}
                        fluid={true}
                        control={Select}
                        options={authType}
                        label={<Header content='account type'/>}
                    />
                    </div>
                    <Divider />
                    <Button primary size='huge' content='Submit' fluid />
                    <Divider />
                </Container>
            </Container>
        );
    }
}