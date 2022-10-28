const express = require('express');
const app = express();
const {Pool} = require('pg');
var cors = require('cors');

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false
    }
   });
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://rebeccaandfasih.github.io');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/*app.use(
    cors({
        credentials: true,
        origin: 'https://rebeccaandfasih.github.io'
    }),
    express.json()
);
app.options('*', cors());
*/
app.get('/guests/:hostId', function (req, res) {
    connection.query(`SELECT * FROM guests WHERE host_id = ` + req.hostId + `;`, (err, queryRes) => {
        if (err) {
            console.log("Error - Failed to select all from guests for hostId: " + req.hostId);
            console.log(err);
        }
        else{
           res.send(queryRes.rows.map(function(party){
               var convertedParty = {"guestNames" : party.names, "guestNumber" : party.number};
               return convertedParty;
           }));
        }
    });
});

app.post('/addGuests', function (req, res) {
    if(req.body){
        if(!req.body.hostId){
            res.status(500);
            res.send("Host ID not provided");
        }
        else if(!req.body.guestNames){
            res.status(500);
            res.send("Guest names not provided");
        }
        else if(!req.body.guestNumber){
            res.status(500);
            res.send("Guest number not provided");
        }
        else {
            connection.query(`INSERT INTO guests(names,number,host_id) VALUES($1,$2,$3)`, 
            [ req.body.guestNames, req.body.guestNumber, req.body.hostId], (err, queryRes) => {
                if (err) {
                    console.log("Error - Failed to insert data into guests for hostId: " + req.body.hostId);
                    console.log(err);
                }
                else{
                    res.send("Success");
                }
            });
        }
    }
    else{
        res.status(500)
        res.send("No guest information provided in body of request");
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});