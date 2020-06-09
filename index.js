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
// Serve static files from the React app
let devDepartmentID = ['recPOMw3GCT2Dc8vC', 'recHcQSjdezz7FtHk', 'recI4EIhOKndHhz3w', 'recAu5jA3PcLq0pWx', 'recrFpcqSXuEVqWwc',
  'recQx8umaexJhpRkf', 'rec2HJXIYf96aCiPL', 'recuDQAL7whliJqNW']
let prodDepartmentID = ['reckvYOO0PzaJHBEO', 'reccT2a4xrfHdaWQw', 'recdLQ028X3lNM2cI', 'rec5bhBln2STwvS5J', 'recWmBubcaaM1VpFo',
  'reclekM7urdRnUktr', 'recxoVftisPeg7LYX', 'recZk2SwrJXtoeTW8']
app.use(express.static(path.join(__dirname, 'client/build')));
let deptArray = [['CCH9-STICU', prodDepartmentID[0]], ['Main1-ED', prodDepartmentID[1]],
['CCH11-MRICU', prodDepartmentID[2]], ['CCH11-NSICU', prodDepartmentID[3]], ['N9-ICT', prodDepartmentID[4]],
['Main5-OR', prodDepartmentID[5]], ['ACC-OR', prodDepartmentID[6]], ['ACC-Anesthesia', prodDepartmentID[7]]]

// Use the regular Map constructor to transform a 2D key-value Array into a map
let departmentMap = new Map(deptArray)

departmentMap.get('key1') // returns "value1"

app.post('/addNewStaff', (req, res) => {
  console.log("The request", req.body);
  const airtable = new AirtablePlus({
    baseID: process.env.REACT_APP_API_AIRTABLE_BASE,
    apiKey: process.env.REACT_APP_API_AIRTABLE_KEY,
    tableName: 'Staff',
  });
  if (req.body.barcode == '') {
    res.status(200).send({ message: 'Must scan a barcode', severity: 'warning' });
  } else {
    (async () => {
      try {
  
        console.log(req.body);
        const staffRes = await airtable.read({
          filterByFormula: `{Staff Barcode} = "${req.body.barcode}"`
        });
  
  
        if (staffRes.length === 1) {
          res.status(200).send({ message: 'User already exists', severity: 'warning' });
        } else {
          let buildingFloorUnit = departmentMap.get(req.body.department);
          if(buildingFloorUnit != null) {
            await airtable.create({
              "Name": req.body.lastname + ", " + req.body.firstname,
              "Email": req.body.email,
              "Phone Number": req.body.textmask,
              "Building/Floor/Unit": [
                buildingFloorUnit
              ],
              "Staff Barcode": { "text": req.body.barcode },
            })
          } else {
            await airtable.create({
              "Name": req.body.lastname + ", " + req.body.firstname,
              "Email": req.body.email,
              "Phone Number": req.body.textmask,
              "Staff Barcode": { "text": req.body.barcode },
            })
          }
          res.status(200).send({ message: 'Success!', severity: 'success' });
        }
      } catch (e) {
      console.error(e);
    }
  })();
  }
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
      let updateRes = '';
      if (buildingFloorUnit != null) {
        updateRes = await airtable.update(staffRes[0].id, {
          "Name": req.body.lastname + ", " + req.body.firstname,
          "Email": req.body.email,
          "Phone Number": req.body.textmask,
          "Building/Floor/Unit":
            [buildingFloorUnit]
          ,
        });
      } else {
        updateRes = await airtable.update(staffRes[0].id, {
          "Name": req.body.lastname + ", " + req.body.firstname,
          "Email": req.body.email,
          "Phone Number": req.body.textmask,
        });
      }

      console.log("success")

      res.status(200).send({ message: 'Success!', severity: 'success', data: updateRes });

    }
    catch (e) {
      console.error(e);
    }
  })();
})

app.post('/getMaskInformation', (req, res) => {
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
        console.log("here not found");
        res.status(200).send({ message: 'Mask not found', severity: 'warning' });
      }
      for (let role of departmentMap.values()) {
        console.log(role);
      }
      res.status(200).send({ message: 'Success!', severity: 'success', maskInfo: maskRes });

    }
    catch (e) {
      console.error(e);
    }
  })();
})
app.post('/addNewMask', (req, res) => {
  console.log("The request", req.body);
  const airtable = new AirtablePlus({
    baseID: process.env.REACT_APP_API_AIRTABLE_BASE,
    apiKey: process.env.REACT_APP_API_AIRTABLE_KEY,
    tableName: 'Masks',
  });
  if (req.body.mask_barcode == '') {
    res.status(200).send({ message: 'Must scan a barcode', severity: 'warning' });
  } else {
    (async () => {
      try {
  
        console.log(req.body);
        const maskRes = await airtable.read({
          filterByFormula: `{Mask Barcode} = "${req.body.mask_barcode}"`
        });
  
  
        if (maskRes.length === 1) {
          res.status(200).send({ message: 'Mask already exists', severity: 'warning' });
        } else {
          let unitCode = departmentMap.get(req.body.department);
          if(unitCode != null) {
            await airtable.create({
              "Mask Barcode": { "text": req.body.mask_barcode, "type": "" },
              "Mask Type": req.body.mask_type,
              "Unit Code": [unitCode],
              "Sterilize Cycles": 0,
            })
          } else {
            await airtable.create({
              "Mask Barcode": { "text": req.body.mask_barcode, "type": "" },
              "Mask Type": req.body.mask_type,
              "Sterilize Cycles": 0,
            })
          }
          res.status(200).send({ message: 'Success!', severity: 'success' });
        }
      } catch (e) {
      console.error(e);
    }
  })();
  }
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
        if (unit != null) {
          const updateRes = await airtable.update(maskRes[0].id, {
            'Unit Code': [unit],
            'Sterilize Cycles': maskRes[0].fields['Sterilize Cycles'] + cycle
          })
          res.status(200).send({ message: 'Success!', severity: 'success', data: updateRes });
        } else {
          const updateRes = await airtable.update(maskRes[0].id, {
            'Sterilize Cycles': maskRes[0].fields['Sterilize Cycles'] + cycle
          })
          res.status(200).send({ message: 'Success!', severity: 'success', data: updateRes });
        }
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
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

const port = process.env.PORT || 5005;
app.listen(port);

console.log(`Password generator listening on ${port}`);