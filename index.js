const express = require('express');
const app = express();
var cors = require('cors');

app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());

app.get('/guests', (req, res) => res.send('Ashley Laird, Bruce Laird'));

app.post('/addGuests', function (req, res) {
    
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});