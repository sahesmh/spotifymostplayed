import React, { Component } from 'react';
import queryString from 'query-string'

class Callback extends Component {
    state = {
        toHome : false,
    }
    
    componentDidMount() {
        // We should arrive here from the Spotify API callback
        const values = queryString.parse(this.props.location.search)
        const code = values.code
        const state = values.state

        // Construct next query string
        let apiURL = "http://localhost:5000/callback?" + 
            queryString.stringify({
                code: code,
                state: state
            });
        
        // Get tokens
        console.log("Token request URL: ", apiURL)
        fetch(apiURL)
            .then((response) => {
                console.log(response)
                return response.json();
            })
            .then((myJSON) => {
                console.log(JSON.stringify(myJSON));
                // Store in session storage
                sessionStorage.setItem('user_access_token', myJSON.access_token);
                sessionStorage.setItem('user_refresh_token', myJSON.refresh_token);
                // this.setState(() => ({
                //     toHome : true
                // }))
                this.props.history.push('/app')
            })
    }

    render() {        
        return (
            <div className="App">
                <p>Authenticating...</p>
            </div>
        );
    }
}

export default Callback;