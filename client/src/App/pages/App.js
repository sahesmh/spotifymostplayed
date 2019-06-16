import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Home from './Home';
import Nav from './Nav';

import Short from './Short';
import Medium from './Medium';
import Long from './Long';


class App extends Component {
  render() {
    const App = () => (
      <div>        
        <Nav />
        <Switch>                    
          <Route exact path='/' component={Home}/>
          <Route path='/short' component={Short}/>
          <Route path='/medium' component={Medium}/>
          <Route path='/long' component={Long}/>
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
