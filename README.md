# Spotify Most Played
Node.js application that will show users their most played songs on Spotify

Readme page in progress

## Configuring the application
1. Create a Spotify Developer account
1. Register your application, and obtain your Client ID and Client Secret codes
1. Create a `.env` file in the root directory of this app. The file contents should be:
```
CLIENT_ID=<Your client ID>
CLIENT_SECRET=<Your client secret>
```
1. `yarn install`

## Running the application
### Server
`yarn start-express`

`yarn dev-express` to run with nodemon

### Client
`yarn start-react`

`yarn dev-react` to run with nodemon

### Both (if you're feeling adventurous)
`yarn start-all`

`yarn dev-all` to run with nodemon