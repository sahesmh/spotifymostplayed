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
        const request = async() => {
            const response = await fetch('http://localhost:5000/auth/spotify', {redirect: 'follow'});
            const resjson = await response.json();
            console.log(resjson);
            // Redirect to /app
            window.location.assign(resjson.redirect_url);
        }

        request();
    }
}

export default withRouter(Login);