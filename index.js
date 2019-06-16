const express = require('express');
const path = require('path');

// Create Express Application
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'client/public')));
// app.use(express.static(path.join(__dirname, 'client/build')));

// API ENDPOINTS
// Placeholder endpoint
app.get('/api/placeholder', (req, res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
})

// 'Any Other Request' endpoint
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

// Start listening
const port = process.env.PORT || 5000;
app.listen(port);

console.log('Express Application is listening on port ' + port);