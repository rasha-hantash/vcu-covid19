const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');

const app = express();

// const dotenv = require('dotenv');
// dotenv.config();
require('dotenv').config();
// Object.prototype.getKey = function(value) {
//         var object = this;
//         console.log('get key')
//         return Object.keys(object).find(key => object[key] === value);
//       };
const AirtablePlus = require('airtable-plus');
var cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
https://airtable.com/tblNWofzBhfqW44OA/viwCptq3RJc3sbXLw/recrFpcqSXuEVqWwc
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
let deptArray = [['CCH9-STICU', 'recPOMw3GCT2Dc8vC'], ['Main1-ED', 'recHcQSjdezz7FtHk'],
['CCH11-MRICU', 'recI4EIhOKndHhz3w'], ['CCH11-NSICU', 'recAu5jA3PcLq0pWx'], ['N9-ICT', 'recrFpcqSXuEVqWwc'],
['Main5-OR', 'recQx8umaexJhpRkf'], ['ACC-OR', 'rec2HJXIYf96aCiPL'], ['ACC-Anesthesia', 'recuDQAL7whliJqNW']]

// Use the regular Map constructor to transform a 2D key-value Array into a map
let departmentMap = new Map(deptArray)

departmentMap.get('key1') // returns "value1"

app.post('/addNewStaff', (req, res) => {
  console.log("The request", req.body);
  var Airtable = require('airtable');
  console.log(process.env);


  var base = new Airtable({ apiKey: process.env.REACT_APP_API_AIRTABLE_KEY }).base(process.env.REACT_APP_API_AIRTABLE_BASE);
  console.log(base);
  console.log(base);
  let buildingFloorUnit = departmentMap.get(req.body.department);
  base('Staff').create([
    {
      "fields": {
        "Name": req.body.lastname + ", " + req.body.firstname,
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
    res.status(200).send({ message: 'Success!', severity: 'success' });
  });

});

app.post('/getStaffInformation', (req, res) => {
  const airtable = new AirtablePlus({
    baseID: process.env.REACT_APP_API_AIRTABLE_BASE,
    apiKey: process.env.REACT_APP_API_AIRTABLE_KEY,
    tableName: 'Staff',
  });



  (async () => {
    try {

      console.log(req.body);
      const staffRes = await airtable.read({
        filterByFormula: `{Staff Barcode} = "${req.body.barcode}"`
      });


      if (staffRes.length === 0) {
        console.log("here not found");
        res.status(200).send({ message: 'User not found', severity: 'warning' });
      }
      for (let role of departmentMap.values()) {
        console.log(role);
      }


      // console.log("department key", departmentMap.getKey("recPOMw3GCT2Dc8vC"))
      console.log(staffRes[0].fields['Building/Floor/Unit'][0])
      // console.log("get key by value", getKeyByValue(departmentMap, "recPOMw3GCT2Dc8vC"))
      console.log("this is staff res", staffRes)
      res.status(200).send({ message: 'Success!', severity: 'success', staffInfo: staffRes });

    }
    catch (e) {
      console.error(e);
    }
  })();
})
app.post('/updateStaff', (req, res) => {
  const airtable = new AirtablePlus({
    baseID: process.env.REACT_APP_API_AIRTABLE_BASE,
    apiKey: process.env.REACT_APP_API_AIRTABLE_KEY,
    tableName: 'Staff',
  });



  (async () => {
    try {

      console.log(req.body);
      const staffRes = await airtable.read({
        filterByFormula: `{Staff Barcode} = "${req.body.barcode}"`
      });


      if (staffRes.length === 0) {
        console.log("here not found");
        res.status(200).send({ message: 'User not found', severity: 'warning' });
      }

      console.log("this is staffres", staffRes)
      console.log("department", staffRes[0].fields['Building/Floor/Unit'])
      // TODO: be able to grab value from departmentMap to update form
      let buildingFloorUnit = departmentMap.get(req.body.department);
      console.log(buildingFloorUnit)
      const updateRes = await airtable.update(staffRes[0].id, {
        "Name": req.body.lastname + ", " + req.body.firstname,
        "Email": req.body.email,
        "Phone Number": req.body.textmask,
        "Building/Floor/Unit":
          [buildingFloorUnit]
        ,
      });
      console.log("success")

      res.status(200).send({ message: 'Success!', severity: 'success', data: updateRes });

    }
    catch (e) {
      console.error(e);
    }
  })();
})

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
        "Mask Type": req.body.mask_type,
        "Unit Code": [unitCode],
        "Sterilize Cycles": 0,
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
    console.log("success")

    res.status(200).send({ message: 'Success!', severity: 'success' });
  });

});


app.post('/updateMask', (req, res) => {
  const airtable = new AirtablePlus({
    baseID: process.env.REACT_APP_API_AIRTABLE_BASE,
    apiKey: process.env.REACT_APP_API_AIRTABLE_KEY,
    tableName: 'Masks',
  });

  (async () => {
    try {

      console.log(req.body);
      const maskRes = await airtable.read({
        filterByFormula: `{Mask Barcode} = "${req.body.mask_barcode}"`
      });



      if (maskRes.length === 0) {
        res.status(200).send({ message: 'Mask not found', severity: 'warning' });
      }
      console.log(maskRes[0].fields['Sterilization Alert'])
      console.log(maskRes)
      console.log(maskRes[0].fields['Status'])
      if (maskRes[0].fields['Sterilization Alert'] != null) {
          console.log("STERILIZATION NOT EMPTY")
          res.status(200).send({ message: 'Mask has reached MAX cycle use. Please destroy mask', severity: 'error' });
      }


      if (req.body.destroy === true) {
        await airtable.update(maskRes[0].id, {
          'Status': 'Destroyed',
          'Why Destroyed': req.body.destroyReason
        })
        res.status(200).send({ message: 'Success!', severity: 'success' });
      } else {

        cycle = 0
        if (req.body.inc == true) {
          cycle = 1
        }
        if (req.body.dec == true) {
          cycle = -1
        }
        let unit = departmentMap.get(req.body.department);
        console.log(unit)
        const updateRes = await airtable.update(maskRes[0].id, {
          'Unit Code': [unit],
          'Sterilize Cycles': maskRes[0].fields['Sterilize Cycles'] + cycle
        })
        res.status(200).send({ message: 'Success!', severity: 'success', data: updateRes });
      }



    }
    catch (e) {
      console.error(e);
    }
  })();
})


app.post('/assignMaskToUser', (req, res) => {
  const airtable = new AirtablePlus({
    baseID: process.env.REACT_APP_API_AIRTABLE_BASE,
    apiKey: process.env.REACT_APP_API_AIRTABLE_KEY,
    tableName: 'Staff',
  });



  (async () => {
    try {

      console.log(req.body);
      const staffRes = await airtable.read({
        filterByFormula: `{Staff Barcode} = "${req.body.staff_barcode}"`
      });


      if (staffRes.length === 0) {
        console.log("here not found");
        res.status(200).send({ message: 'User not found', severity: 'warning' });
      }
      console.log(staffRes)

      const cfg = { tableName: 'Masks' };
      const maskRes = await airtable.read({
        filterByFormula: `{Mask Barcode} = "${req.body.mask_barcode}"`
      }, cfg);
      if (maskRes.length === 0) {
        console.log("here not found");
        res.status(200).send({ message: 'Mask not found', severity: 'warning' });
      }

      const updateRes = await airtable.update(maskRes[0].id, {
        'Owner': [staffRes[0].id]
      }, cfg);
      console.log("success")
      res.status(200).send({ message: 'Success!', severity: 'success' });

    }
    catch (e) {
      console.error(e);
    }
  })();
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);