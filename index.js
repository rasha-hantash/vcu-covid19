const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');

const app = express();

// const dotenv = require('dotenv');
// dotenv.config();
require('dotenv').config();

const AirtablePlus = require('airtable-plus');
var cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
let kvArray = [['CCH9-STICU', 'recQ0l2LfPFDebWQs'], ['Main1-ED', 'recIopo1MrlaIEh2a'],
['CCH11-MRICU', 'recJgdeZnX9Oignom'], ['CCH11-NSICU', 'recBGEPiC2Ym1Zdhn'], ['N9-ICT', 'recsRYI8ragfwpKR2'],
['Main5-OR', 'recRJH04JrjkSoFF5'], ['ACC-OR', 'rec3TitqxsVHLB6aB'], ['ACC-Anesthesia', 'recvPp6tGJ3WTIe8M']]

// Use the regular Map constructor to transform a 2D key-value Array into a map
let departmentMap = new Map(kvArray)

departmentMap.get('key1') // returns "value1"


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


  var base = new Airtable({ apiKey: process.env.REACT_APP_API_AIRTABLE_KEY }).base(process.env.REACT_APP_API_AIRTABLE_BASE);
  console.log(base);
  console.log(base);
  let buildingFloorUnit = departmentMap.get(req.body.department);
  console.log("This is the building floor unit ", buildingFloorUnit);
  base('Staff').create([
    {
      "fields": {
        "Name": req.body.firstname + " " + req.body.lastname,
        "Email": req.body.email,
        "Phone Number": req.body.textmask,
        "Building/Floor/Unit": [
          buildingFloorUnit
        ],
        "Staff Barcode": { "text": req.body.barcode, "type": "" },
      }
    }
  ], function (err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });

});


app.post('/addNewMask', (req, res) => {
  console.log("The request", req.body);
  var Airtable = require('airtable');
  // console.log(process.env);
  var base = new Airtable({ apiKey: process.env.REACT_APP_API_AIRTABLE_KEY }).base(process.env.REACT_APP_API_AIRTABLE_BASE);

  let unitCode = departmentMap.get(req.body.department);
  base('Masks').create([
    {
      "fields": {
        "Mask Barcode": { "text": req.body.mask_barcode, "type": "" },
        "Unit Code": [unitCode],
        "Sterilize Cycles": 0,
        "Mask Type": "3D-printed"
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

app.post('/retrieveRecordsFromStaffByBarcode', (req, res) => {

  

  // baseID, apiKey, and tableName can alternatively be set by environment variables
  const airtable = new AirtablePlus({
    baseID: process.env.REACT_APP_API_AIRTABLE_BASE,
    apiKey: process.env.REACT_APP_API_AIRTABLE_KEY,
    tableName: 'Staff',
  });

  console.log(req.body);

  (async () => {
    try {
      const cfg = { tableName: 'Masks' };
      const maskRes = await airtable.read({
        filterByFormula: `{User Barcode} = "${req.body.barcode}"`
      }, cfg);
      
      const staffRes = await airtable.read({
        filterByFormula: `{Staff Barcode} = "${req.body.barcode}"`
      });

      let result = [];
      result[0] = staffRes;
      result[1] = maskRes;
      console.log("this is result[0]: ", result[0]);
      console.log("this is result[1] ", result[1]);
      res.json(result);

    }
    catch (e) {
      console.error(e);
    }
  })();
});




// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);