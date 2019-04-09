import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container, Divider } from 'semantic-ui-react';
import TopMenu from '../components/topmenu';
import ProfilesTab from '../components/profiles.tab'
import SettingsTab from '../components/settings.tab';
import './App.css';
import MfaAuth from '../components/mfaauth';
import Signup from '../components/signup';
import {addTodo} from '../redux/actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'main',
      activeMenuItem: 'profiles'
    };
    console.log(this.props.addTodo('hello'));
    this.handleItemClick = this.handleItemClick.bind(this);
  }
  handleItemClick(e, data) {
    this.setState({
      activeMenuItem: data.name
    });
  }
  render() {
    const activeItem = this.state.activeMenuItem;
    const menuItems = ['profiles', 'settings'];
    if(this.state.page === 'register') {
      return (
        <Container padded='true' className='App'>
          <Signup/>
        </Container>
      )
    }
    if(this.state.page === 'main') {
      return (
        <Container padded='true' className='App'>
          <Container>
            <TopMenu activeItem={activeItem} onChange={this.handleItemClick} menuItems={menuItems} />
            <Divider />
            { activeItem === 'profiles' ? <ProfilesTab /> : <SettingsTab /> }
          </Container>
        </Container>
      );
    }else{
      return (
        <MfaAuth />
      );
    }
    
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  addTodo: (data) => dispatch(addTodo(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
