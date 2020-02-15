import React, { Component } from 'react';
import queryString from 'query-string'

class Long extends Component {
    state = {
        long_term: ''
    }
    componentDidMount() {
        console.log(sessionStorage.getItem('user_access_token') || "NO ACCESS TOKEN");
        console.log(sessionStorage.getItem('user_refresh_token') || "NO REFRESH TOKEN");

        let apiURL = "http://localhost:5000/get-most-played?" + 
            queryString.stringify({
                length: "long_term",
                access_token: sessionStorage.getItem("user_access_token")
            });        
        fetch(apiURL)
            .then((response) => {                
                return response.json();
            })
            .then((myJSON) => {
                this.setState(() => ({
                    long_term: myJSON
                }))
                console.log(myJSON)
            })
    }

    generatePlaylist() {        
        let songsArray = Object.values(this.state.long_term['trackData']);
        console.log("Songs Array (?): ");
        console.log(songsArray);
        // let reducer = (accumulator, currentValue) => accumulator + ',' + currentValue;
        // let songs = songsArray.reduce(reducer);
        let songs = songsArray.map(track => (track.uri)).join(',');
        
        
        let apiURL = "http://localhost:5000/create-playlist?" + 
            queryString.stringify({
                length: "long_term", 
                access_token: sessionStorage.getItem("user_access_token"),
                songList: songs
            });
        console.log(apiURL);
        fetch(apiURL).then((response) => {
            console.log(response.successful === true)
        })
    }

    render() {
        if (this.state.long_term !== '') {
            // Data is stored as an object, need to convert to array for map function
            const longTermArr = Object.values(this.state.long_term["trackData"]);
            return (
                <div className="App">
                    <h1>Long-Term Most Played</h1>
                    <ol>
                    {
                        // Format: X. Song Title - Artist 1, Artist2, ..., Artists N
                        longTermArr.map(track => (
                            <li>{track.name} - {
                                track.artists.slice(0,track.artists.length-1).map(artist => (
                                    artist.name + ", "
                                ))}{track.artists[track.artists.length-1].name}</li>
                    ))}
                    </ol>                    
                    <button onClick={(event) => { this.generatePlaylist(event) }}>
                        Generate Playlist
                    </button>
                </div>
                
            );
        }
        return (
            <div className="App">
                <h1>Long-Term Most Played</h1>
                <p>No data in session storage, something went wrong :(</p>
            </div>
        );
    }
}

export default Long;