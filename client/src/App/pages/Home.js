import React, { Component } from 'react';

class Home extends Component {
    componentDidMount() {
        console.log(sessionStorage.getItem('user_access_token') || "NO ACCESS TOKEN");
        console.log(sessionStorage.getItem('user_refresh_token') || "NO REFRESH TOKEN");
    }

    render() {
        return (
            <div className="App">
                <h1>Welcome To Spotify Most Played Playlist Generator</h1>                
            </div>
        );
    }
}

export default Home;