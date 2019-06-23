import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App/pages/App';
import * as serviceWorker from './serviceWorker';
import Login from './App/pages/Login';

render((
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/app' component={App}/>
        </Switch>
        
    </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
