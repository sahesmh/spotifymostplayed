import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
require('dotenv').config();


class Login extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        return (
            <div className="App">
                <h1>Spotify Most Played Playlist Generator</h1>
                <button onClick={this.handleClick}>Click here to log in to your Spotify Account</button>
            </div>
        );
    }

    handleClick() {
        fetch('http://localhost:5000/auth/spotify')
            .then(function(response) {
                return response.json();
            })
            .then(function(myJSON) {
                console.log(JSON.stringify(myJSON));
                window.location.assign(myJSON.redirect_url);
            })
        }
}

export default withRouter(Login);