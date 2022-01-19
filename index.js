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

app.use(
    cors({
        credentials: true,
        origin: true
    }),
    express.json()
);
app.options('*', cors());

app.get('/guests', function (req, res) {
    connection.query(`SELECT * FROM guests;`, (err, queryRes) => {
        if (err) {
            console.log("Error - Failed to select all from guests");
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
        if(!req.body.guestNames){
            res.status(500);
            res.send("Guest names not provided");
        }
        if(!req.body.guestNumber){
            res.status(500);
            res.send("Guest number not provided");
        }
        if(req.body.guestNames && req.body.guestNumber){
            connection.query(`INSERT INTO guests(names,number) VALUES($1,$2)`, [ req.body.guestNames, req.body.guestNumber], (err, queryRes) => {
                if (err) {
                    console.log("Error - Failed to insert data into guests");
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