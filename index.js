const express = require('express');
const app = express();
const {Pool} = require('pg');
var cors = require('cors');

const connection = new Pool({
    connectionString: 'postgres://zkhvazqhatabmv:fe4c0862f488ea99564dae2fb51275fb5e104959c87260502f4498c9e2e293d0@ec2-107-20-24-247.compute-1.amazonaws.com:5432/d96e0d5g4vrguk',
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
           res.send(queryRes.rows.map(party => {"guestNames" = party.names, "guestNumber" = party.number}));
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