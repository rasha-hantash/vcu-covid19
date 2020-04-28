const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');

const app = express();

// const dotenv = require('dotenv');
// dotenv.config();
require('dotenv').config();


var cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // Return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});

app.post('/getMaskRecords', (req, res) => {
  console.log("The request", req.body.maskID);
  // console.log("The json.maskID",req.body.maskID);
  // let maskID = req.body.maskID;
  // console.log("MASK ID", maskID);
  let Airtable = require('airtable');
  let base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY);
  // filterByFormula: 'Find("${my_name}", Mask)'
  //1000002
  var filter = "Find(\"" + `${req.body.maskID}` + "\"" + ", Mask)";
  //'Find("1000002", Mask)'
  console.log("Filter", filter);
  base('Mask Uses').select({
    view: "Grid view",
    filterByFormula: filter
  }).eachPage(function page(records, fetchNextPage) {
    res.json(records);
    records.forEach(function (record) {
      ;
      if (record.get('Mask') == "1000002") {
        console.log('Retrieved', record.get('Name') + " " + record.get("Mask Uses"));
      }
      //  
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
  });
});

app.post('/addNewStaff', (req, res) => {
  console.log("The request", req.body);
  var Airtable = require('airtable');
  console.log(process.env);
  
 
  var base = new Airtable({ apiKey: process.env.REACT_APP_API_AIRTABLE_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE_KEY);
  console.log(base);
  console.log(base);
  //     name,
  //     barcode,
  //     department,
  //     textmask,
  //     scanning,
  //     lastresult
  base('Staff').create([
    {
      "fields": {
        "Name": req.body.name,
        "Phone Number": "(123) 456-7890",
        "Building/Floor/Unit": [
          "recRJH04JrjkSoFF5"
        ],
        "Staff Barcode": {"text":req.body.barcode,"type":""},
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });

});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);