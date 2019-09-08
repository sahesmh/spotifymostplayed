import React, { Component } from 'react';
import queryString from 'query-string'

class Medium extends Component {
    state = {
        medium_term: ''
    }
    componentDidMount() {
        console.log(sessionStorage.getItem('user_access_token') || "NO ACCESS TOKEN");
        console.log(sessionStorage.getItem('user_refresh_token') || "NO REFRESH TOKEN");

        let apiURL = "http://localhost:5000/get-most-played?" + 
            queryString.stringify({
                length: "medium_term",
                access_token: sessionStorage.getItem("user_access_token")
            });
        console.log("Medium-term URL: ", apiURL)
        fetch(apiURL)
            .then((response) => {
                console.log(response)
                return response.json();
            })
            .then((myJSON) => {
                console.log(JSON.stringify(myJSON));
                
                this.setState(() => ({
                    medium_term: myJSON
                }))                
            })
    }
    render() {
        if (this.state.medium_term !== '') {
            return (
                <div className="App">
                    <h1>Medium-Term Most Played</h1>
                    <p>Medium Term Found! See Browser Console Output</p>
                </div>
            );
        }
        return (
            <div className="App">
                <h1>Medium-Term Most Played</h1>                
            </div>
        );
    }
}

export default Medium;