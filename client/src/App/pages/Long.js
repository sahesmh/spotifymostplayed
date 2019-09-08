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
        console.log("Long-term URL: ", apiURL)
        fetch(apiURL)
            .then((response) => {
                console.log(response)
                return response.json();
            })
            .then((myJSON) => {
                console.log(JSON.stringify(myJSON));
                
                this.setState(() => ({
                    long_term: myJSON
                }))                
            })
    }
    render() {
        if (this.state.long_term !== '') {
            return (
                <div className="App">
                    <h1>Long-Term Most Played</h1>
                    <p>Long Term Found! See Browser Console Output</p>
                </div>
            );
        }
        return (
            <div className="App">
                <h1>Long-Term Most Played</h1>                
            </div>
        );
    }
}

export default Long;