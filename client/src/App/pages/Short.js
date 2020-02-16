import React, { Component } from 'react';
import queryString from 'query-string'

class Short extends Component {
    state = {
        short_term: '',
        generatedSuccessfuly : false,
        playlistID: ''
    }
    componentDidMount() {
        console.log(sessionStorage.getItem('user_access_token') || "NO ACCESS TOKEN");
        console.log(sessionStorage.getItem('user_refresh_token') || "NO REFRESH TOKEN");

        let apiURL = "http://localhost:5000/get-most-played?" + 
            queryString.stringify({
                length: "short_term",
                access_token: sessionStorage.getItem("user_access_token")
            });        
        fetch(apiURL)
            .then((response) => {                
                return response.json();
            })
            .then((myJSON) => {
                this.setState(() => ({
                    short_term: myJSON
                }))
                console.log(myJSON)
            })
    }

    generatePlaylist() {        
        let songsArray = Object.values(this.state.short_term['trackData']);
        let songs = songsArray.map(track => (track.uri)).join(',');
        
        
        let apiURL = "http://localhost:5000/create-playlist?" + 
            queryString.stringify({
                length: "short_term", 
                access_token: sessionStorage.getItem("user_access_token"),
                songList: songs
            });
        console.log(apiURL);
        
        fetch(apiURL).then((response) => {
            const resJSON = response.json();            
            this.setState((state, props) => {
                return {
                    generatedSuccessfuly : resJSON.successful,
                    playlistID: resJSON.playlistID
                }
            });
            console.log("Successful creation of playlist " + resJSON.playlistID + ": " + resJSON.successful)
        })
    }

    render() {
        if (this.state.short_term !== '') {
            // Data is stored as an object, need to convert to array for map function
            const shortTermArr = Object.values(this.state.short_term["trackData"]);
            return (
                <div className="App">
                    <h1>Short-Term Most Played</h1>
                    <ol>
                    {
                        // Format: X. Song Title - Artist 1, Artist2, ..., Artists N
                        shortTermArr.map(track => (
                            <li>{track.name} - {
                                track.artists.slice(0,track.artists.length-1).map(artist => (
                                    artist.name + ", "
                                ))}{track.artists[track.artists.length-1].name}</li>
                    ))}
                    </ol>                    
                    <button onClick={(event) => {this.generatePlaylist(event)}}>
                        {!this.state.generatedSuccessfuly ? "Click to Generate Playlist" : "Playlist Generated! Click to make it again..."}
                    </button>
                </div>                
            );
        }
        return (
            <div className="App">
                <h1>Short-Term Most Played</h1>
                <p>No data in session storage, something went wrong :(</p>
            </div>
        );
    }
}

export default Short;