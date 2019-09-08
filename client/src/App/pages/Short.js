import React, { Component } from 'react';
import queryString from 'query-string'

class Short extends Component {
    state = {
        short_term: ''
    }
    componentDidMount() {
        console.log(sessionStorage.getItem('user_access_token') || "NO ACCESS TOKEN");
        console.log(sessionStorage.getItem('user_refresh_token') || "NO REFRESH TOKEN");

        let apiURL = "http://localhost:5000/get-most-played?" + 
            queryString.stringify({
                length: "short_term",
                access_token: sessionStorage.getItem("user_access_token")
            });
        console.log("Short-term URL: ", apiURL)
        fetch(apiURL)
            .then((response) => {
                console.log(response)
                return response.json();
            })
            .then((myJSON) => {
                console.log(JSON.stringify(myJSON));
                
                this.setState(() => ({
                    short_term: myJSON
                }))                
            })
    }
    render() {
        if (this.state.short_term !== '') {
            return (
                <div className="App">
                    <h1>Short-Term Most Played</h1>
                    <p>Short Term Found! See Browser Console Output</p>
                </div>
            );
        }
        return (
            <div className="App">
                <h1>Short-Term Most Played</h1>                
            </div>
        );
    }
}

export default Short;