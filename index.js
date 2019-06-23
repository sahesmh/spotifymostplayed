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

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email user-top-read';
    console.log('Auth requrest recieved')
    res.json({
        redirect_url: 'https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: scope,
            redirect_uri: 'http://localhost:5000/auth/spotify/callback',            
            state: state
        })
    })    
});

// Spotify Callback enpoint
app.get('/auth/spotify/callback', function(req, res) {

    // Request refresh and access tokens after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    console.log(req.cookies);
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    // Verify State
    if (state === null || state !== storedState) {
        console.log('ERR: State Mismatch.', state, storedState)
        res.redirect('/#' +
            queryString.stringify({
            error: 'state_mismatch'
        }));
        
    } else {
        // Clear state
        res.clearCookie(stateKey);
        
        // Construct Authorisation options
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + 
                    (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
            },
            json: true
        };
        
        // Request tokens
        request.post(authOptions, function(error, response, body) {
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
                res.json({
                    access_token: access_token,
                    refresh_token: refresh_token
                })
                
            } else {
            res.redirect('/#' +
                querystring.stringify({
                error: 'invalid_token'
                }));
            }
        });
    }
});

// Get Long-Term Songs endpoint
app.get('/generate_playlist', function(req, res) {
    console.log("Requesting songs");
    // Construct Authorisation Options
    var authOptions = {
        url: 'https://api.spotify.com/v1/me/top/tracks?' + 
            querystring.stringify({
                'time_range': 'long_term',
                'limit': 50
        }),        
        headers: {
            'Accept'        : 'application/json',
            'Content-Type'  : 'application/json',
            'Authorization' : 'Bearer ' + req.query.access_token
        },        
        json: true
    };

    // Request Tracks
    request.get(authOptions, function(error, response, body) {        
        console.log("GET Response ", response.statusCode);        
        if (!error && response.statusCode === 200) {
            let numTracks = body.items.length;
            let trackData = {};
            for (trackNum = 0; trackNum < numTracks; trackNum++) {
                let track = {
                    uri     : body.items[trackNum].uri,                    
                    name    : body.items[trackNum].name
                };
                trackData[trackNum] = track;
            }
            console.log(trackData);
            res.send({
                trackData: trackData
            });
        } else {
            console.log("Error: ", error);
            res.redirect('/#' +
                querystring.stringify({
                error: 'invalid_token'
                }));
            }
    });
});

// 'Any Other Request' endpoint
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

// Start listening
const port = process.env.PORT || 5000;
app.listen(port);

console.log('Express Application is listening on port ' + port);