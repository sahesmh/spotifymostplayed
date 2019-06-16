import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div className="App">
                <h1>Spotify Most Played Playlist Generator</h1>
                {/* Link to List.js */}
                <Link to={'./list'}>
                    <button variant="raised">
                        My List
                    </button>
                </Link>
            </div>
        );
    }
}

export default Home;