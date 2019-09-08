import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Home from './Home';
import Nav from './Nav';

import Short from './Short';
import Medium from './Medium';
import Long from './Long';
import Callback from './Callback';


class App extends Component {
  render() {
    const App = () => (
      <div>        
        <Nav />
        <Switch>          
          <Route path='/app' exact component={Home}/>
          <Route path='/app/callback' component={Callback}/>
          <Route path='/app/short' component={Short}/>
          <Route path='/app/medium' component={Medium}/>
          <Route path='/app/long' component={Long}/>
        </Switch>        
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
