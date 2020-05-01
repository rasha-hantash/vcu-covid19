import React from 'react';
import '../App.css';
import { Container, Button, TextField, InputLabel, InputAdornment, IconButton, MenuItem, Select, Input, FormControl } from '@material-ui/core';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import MaskedInput from 'react-text-mask';
import PropTypes from "prop-types";
import Scanner from './BarcodeScanner/Scanner'
import axios from 'axios';
import CenterFocusWeakOutlinedIcon from '@material-ui/icons/CenterFocusWeakOutlined';
import { useHistory } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddStaffResult from './AddStaffResult';
import { withRouter } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';



const styles = theme => ({
  marginAutoContainer: {
    height: "50%",
    padding: "2vw",
    textAlign: "center",

  },
  marginAutoItem: {
    margin: 'auto'
  },
  alignItemsAndJustifyContent: {
    width: 500,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  root: {
    // '& .MuiTextField-root': {
    //   margin: theme.spacing(1),
    // },

    width: "40%",
    ['@media (max-width:600px)']: { // mobile devices
      marginLeft: "2%",
      width: "95%"

    },

    ['@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait)']: //ipad
    {
      marginLeft: "2%",
      width: "95%",
      fontSize: "30px",
    },
  }
});



function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

class AddStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      barcode: "",
      department: "",
      textmask: '(  )    -    ',
      scanning: false,
      lastresult: [],

    };
    this.addNewStaff = this.addNewStaff.bind(this);
    this.backToMain = this.backToMain.bind(this);

  }

  

  _scan = () => {
    this.setState({ scanning: !this.state.scanning })
  }

  _onDetected = result => {

    this.state.lastresult.push(result.codeResult.code);
    console.log(this.state.lastresult);
    if (this.state.lastresult.length >= 20) {
      this._logResults();
      this.setState({ ...this.state, scanning: false })
      console.log("This is your state", this.state);

    }
  }
  _logResults = () => {
    console.log("This is your result ", this.state.lastresult)
    let code = this._orderByOccurance(this.state.lastresult)[0];
    this.setState({ ...this.state, barcode: code })
  }

  //return the barcode that occured the most during the scan
  _orderByOccurance = (arr) => {
    var counts = {};
    arr.forEach(function (value) {
      if (!counts[value]) {
        counts[value] = 0;
      }
      counts[value]++;
    });
    return Object.keys(counts).sort(function (curKey, nextKey) {
      return counts[curKey] < counts[nextKey];
    });
  }

  //////////^^^^ logic for scanning

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
    console.log(this.state);
  };

  async addNewStaff() {

    console.log("This is the state", this.state)
    const { firstname,
      lastname,
      email,
      barcode,
      department,
      textmask,
      scanning,
      lastresult } = this.state;

    const staffInformation = {
      firstname,
      lastname,
      email,
      barcode,
      department,
      textmask,
      scanning,
      lastresult
    };
    const fullname = this.state.firstname + " " + this.state.lastname;
    this.props.history.push({
      pathname: '/staff/add/result',
      state: staffInformation
    });
    let response = await axios.post('/addNewStaff', staffInformation);


    if (response) {
      const type = await response.json();
      console.log('Login status:');

    } else {
      console.error('Login Failed!');
    }
    // });//.then(() => {
    // if(!response.error){
    //   c
    //  }


    //   this.setState({ records: response.data });
    //   

    // history.push('/staff/add/result', { fullname: fullname });
    // });
    // console.log(response.data);


    // maybe create a this.staff.records variable
    console.log("These are records", this.state.records);

    

  }

  async backToMain() {
      this.props.history.push('/');
  }

  render() {
    const { classes } = this.props;
    console.log(this.props);
    console.log(this.state);

    return (
      <Container className={classes.marginAutoContainer}>

        <IconButton style={{marginRight: '38%'}} onClick={this.backToMain}>
          <ArrowBackIcon></ArrowBackIcon>
        </IconButton>
        <form noValidate autoComplete="off" >



          <TextField required className={classes.root}
            id="standard-full-width"
            name="firstname"
            onChange={event => this.handleChange(event)}
            // style={{ marginBottom: "1%", marginLeft: "2%" }}
            placeholder="Enter First"
            label="Required"
            InputLabelProps={{
              shrink: true,
            }} />
        </form>
        <form>
          <TextField required className={classes.root}
            id="standard-full-width"
            name="lastname"
            onChange={event => this.handleChange(event)}
            // style={{ marginBottom: "1%", marginLeft: "2%" }}
            placeholder="Enter Last Name"
            label="Required"
            InputLabelProps={{
              shrink: true,
            }} />
        </form>
        <form noValidate autoComplete="off" >
          <TextField required className={classes.root}
            id="standard-full-width"
            name="email"
            onChange={event => this.handleChange(event)}
            // style={{ width: "40%", marginBottom: "1%" }}
            placeholder="Enter email"
            label="Required"
            InputLabelProps={{
              shrink: true,
            }} />
        </form>
        <form noValidate autoComplete="off" >
          <TextField required className={classes.root}
            id="standard-full-width"
            name="barcode"
            value={this.state.barcode}
            onChange={event => this.handleChange(event)}
            // style={{ width: "40%", marginBottom: "1%" }}
            placeholder="Scan Staff Barcode" label="Required"
            InputProps={{
              endAdornment: <InputAdornment position="end"><IconButton onClick={this._scan}><CenterFocusWeakOutlinedIcon>

              </CenterFocusWeakOutlinedIcon></IconButton>
              </InputAdornment>,
            }}
            InputLabelProps={{
              shrink: true,

            }}>
          </TextField>

        </form>
        <FormControl className={classes.root} noValidate autoComplete="off">
          <InputLabel required shrink id="demo-simple-select-placeholder-label-label">Department</InputLabel>
          <Select
            name="department"
            value={this.state.department}
            onChange={event => this.handleChange(event)}
            labelId="demo-simple-select-placeholder-label-label"
            id="demo-simple-select-placeholder-label"
            // value={Phone}
            // onChange={this.handlePhoneChange}
            displayEmpty
          // className={classes.selectEmpty}

          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"CCH9-STICU"}>CCH9-STICU</MenuItem>
            <MenuItem value={"Main1-ED"}>Main1-ED</MenuItem>
            <MenuItem value={"CCH11-MRICU"}>CCH11-MRICU</MenuItem>
            <MenuItem value={"CCH11-NSICU"}>CCH11-NSICU</MenuItem>
            <MenuItem value={"N9-ICT"}>N9-ICT</MenuItem>
            <MenuItem value={"Main5-OR"}>Main5-OR</MenuItem>
            <MenuItem value={"ACC-OR"}>ACC-OR</MenuItem>
            <MenuItem value={"ACC-Anesthesia"}>ACC-Anesthesia</MenuItem>
          </Select>
          {/* <FormHelperText>Label + placeholder</FormHelperText> */}
        </FormControl>
        <form noValidate autoComplete="off">
          {/* <InputLabel required shrink id="demo-simple-select-placeholder-label-label">Department</InputLabel> */}
          <InputLabel required  >Phone number</InputLabel>
          <Input className={classes.root}
            value={this.state.textmask}
            onChange={event => this.handleChange(event)}
            name="textmask"
            id="formatted-text-mask-input"
            inputComponent={TextMaskCustom}
          // style={{ width: "40%", marginBottom: "1%" }}
          />
        </form>
        <Button className={classes.root} style={{ marginTop: "1%" }} color="primary" variant="outlined" onClick={this.addNewStaff.bind(this)}>Add Staff</Button>
        <div>
          {(this.state.scanning) ? <Scanner onDetected={this._onDetected} /> : null}
        </div>
      </Container>
    )

  }
}
export default withRouter((withStyles(styles)(AddStaff)));