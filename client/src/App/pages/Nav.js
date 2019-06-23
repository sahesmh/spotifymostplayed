import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <nav>
            <h3>Spotify Most Played</h3>
            <ul>
                <Link to='/app'><li>Home</li></Link>
                <Link to='/app/short'><li>Short-Term</li></Link>
                <Link to ='/app/medium'><li>Medium-Term</li></Link>
                <Link to ='/app/long'><li>Long-Term</li></Link>
            </ul>
        </nav>
    )
}

export default Nav;