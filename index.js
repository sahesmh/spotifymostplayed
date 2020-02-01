require('dotenv').config();

const express = require('express');
const path = require('path');
const request = require('request');
const cors = require('cors');
const queryString = require('querystring');
const cookieParser = require('cookie-parser');

const stateKey = 'spotify_auth_state';

let generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
// Create Express Application
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'client/public')));
app.use(cors());
app.use(cookieParser());

// API ENDPOINTS
// Placeholder endpoint
app.get('/api/placeholder', (req, res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
})

// Spotify Login endpoint
app.get('/auth/spotify', function(req, res) {

    let state = generateRandomString(16);
    res.cookie(stateKey, state);
    console.log(stateKey, state);

    // your application requests authorization
    let scope = 'user-read-private user-read-email user-top-read playlist-modify-private';
    console.log('Auth request received')    
    let responseURL = 'https://accounts.spotify.com/authorize?' +
    queryString.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: 'http://localhost:3000/app/callback',            
        state: state
    });

    console.log("Response will be ", responseURL);

    res.json({
        redirect_url: responseURL
    })    
});

// Spotify Callback enpoint
// app.get('/auth/spotify/callback', function(req, res) {
app.get('/callback/', function(req, res) {
    console.log("Requesting Tokens")
    // Request refresh and access tokens after checking the state parameter

    let code = req.query.code || null;
    // const code = req.params.code || null;
    let state = req.query.state || null;
    // const state = req.params.state || null;
    // console.log(req.cookies);
    // var storedState = req.cookies ? req.cookies[stateKey] : null;

    // Verify State
    // if (state === null || state !== storedState) {
    //     console.log('ERR: State Mismatch.', state, storedState)
    //     res.redirect('/#' +
    //         queryString.stringify({
    //         error: 'state_mismatch'
    //     }));
    if (state == null) {
        // TODO Later: Figure out the best way to check state
        console.log('ERR: No State')
        res.redirect('/#' +
            queryString.stringify({
            error: 'state_mismatch'
        }));
    } else {
        // Clear state
        // res.clearCookie(stateKey);
        
        // Construct Authorisation options
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: 'http://localhost:3000/app/callback',
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + 
                    (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
            },
            json: true
        };
        console.log(authOptions)
        // Request tokens
        request.post(authOptions, function(error, response, body) {
            console.log("Response Status Code: ", response.statusCode)
            if (!error && response.statusCode === 200) {
                
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
                
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                // res.redirect('/#' +
                //     querystring.stringify({
                //     access_token: access_token,
                //     refresh_token: refresh_token
                //     }))
                console.log("Access Token: ", access_token)
                console.log("Refresh Token: ", refresh_token)
                res.json({
                    access_token: access_token,
                    refresh_token: refresh_token
                })
                
            } else {
                console.log("ERROR!" , error);                
            }
        });
    }
});

// Get Most Played Songs endpoint
app.get('/get-most-played', function(req, res) {
    console.log("Requesting songs");

    const length = req.query.length || "long_term" // Will be short_term, medium_term or long_term
    const access_token = req.query.access_token
    
    // Construct Authorisation Options
    var authOptions = {
        url: 'https://api.spotify.com/v1/me/top/tracks?' + 
            queryString.stringify({
                'time_range': length,
                'limit': 50
        }),        
        headers: {
            'Accept'        : 'application/json',
            'Content-Type'  : 'application/json',
            'Authorization' : 'Bearer ' + access_token
        },        
        json: true
    };

    console.log(authOptions)

    // Request Tracks
    request.get(authOptions, function(error, response, body) {        
        console.log("GET Response ", response.statusCode);        
        if (!error && response.statusCode === 200) {            
            let numTracks = body.items.length;
            let trackData = {};
            for (trackNum = 0; trackNum < numTracks; trackNum++) {
                let track = {
                    uri     : body.items[trackNum].uri,                    
                    name    : body.items[trackNum].name,
                    artists : body.items[trackNum].artists
                };
                trackData[trackNum] = track;
            }
            console.log(trackData);
            res.send({
                trackData: trackData
            });
        } else {
            console.log("Error: ", error);
            // TODO Error Handling
            }
    });
});

// Create Playlist endpoint
app.get('/create-playlist', function(req, res) {
    let userID = "UNPOPULATED";
    let playlistID = "UNPOPULATED"
    console.log("Making a playlist")

    // Lets make the bold assumption that making a new playlist
    // will overwrite an old one by the same name. Or at least
    // not break things

    const length = req.query.length || "long_term"
    const access_token = req.query.access_token

    // Get User's ID
    var authOptionsID = {
        url: 'https://api.spotify.com/v1/me',        
        headers: {
            'Accept'        : 'application/json',
            'Content-Type'  : 'application/json',
            'Authorization' : 'Bearer ' + access_token
        },        
        json: true
    };
        
    request.get(authOptionsID, function(error, response, body) {
        console.log("GET Response ", response.statusCode);
        let reqSuccess = !error && response.statusCode === 200;
        if (reqSuccess) {
            userID = body.id;

            // Create new playlist, and store identifier
            var authOptionsPlaylistMake = {
                url: 'https://api.spotify.com/v1/users/' + userID + '/playlists',        
                headers: {
                    'Accept'        : 'application/json',
                    'Content-Type'  : 'application/json',
                    'Authorization' : 'Bearer ' + access_token
                },
                data: queryString.stringify({
                    name: "Most Played - " + length,
                    public: false,
                    collaborative: false,
                    description: "Courtesy of Shane :D"
                }),
                json: true
            };

            request.post(authOptionsPlaylistMake, function(error, response, body) {
                console.log("GET Response ", response.statusCode);
                let reqSuccess = !error && response.statusCode === 200;
                if (reqSuccess) {
                    playlistID = body.id

                    // Replace songs in playlist with new list
                    console.log("User ID: " + userID);
                    console.log("Playlist ID: " + playlistID)
                    res.send({
                        userID: userID,
                        playlistID: playlistID
                    })
                }
            })
                }
    })

    


    

});

// 'Any Other Request' endpoint
app.get('*', (req,res) =>{
    console.log("User reached Any Other Requests endpoint with URL ", req.originalUrl)
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

// Start listening
const port = process.env.PORT || 5000;
app.listen(port);

console.log('Express Application is listening on port ' + port);