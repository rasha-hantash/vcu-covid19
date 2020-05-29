import React from 'react';
import '../App.css';
import {
  Container,
  Button,
  TextField,
  InputLabel,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  Input,
  FormControl,
  Typography,
  AppBar,
  Toolbar,
  Snackbar,
} from '@material-ui/core';
import MaskedInput from 'react-text-mask';
import PropTypes from "prop-types";
import axios from 'axios';
import Scanner from './BarcodeScanner/Scanner'
import CenterFocusWeakOutlinedIcon from '@material-ui/icons/CenterFocusWeakOutlined';
import { withStyles } from "@material-ui/core/styles";

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const styles = (theme) => ({
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

    marginTop: '1em',
    marginBottom: '1em',

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
  },
  appBar: {
    background: '#FFBA00',
    color: 'black'
  },
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


class UpdateStaff extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      barcode: "",
      department: "",
      textmask: "",
      scanning: false,
      lastresult: [],
      severity: 'success',
      message: 'Success!',
      open: false
    };
    this.backToMain = this.backToMain.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
  }

  async backToMain() {
    this.props.history.push('/');
  }

  _scan = () => {
    this.state.lastresult= [];
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

  async _logResults() {
    console.log("This is your result ", this.state.lastresult)
    let code = this._orderByOccurance(this.state.lastresult)[0];
    this.setState({ ...this.state, barcode: code })
    let response = await axios.post('/getStaffInformation', this.state);
    console.log("response staff info", response)
    let fullname = response.data.staffInfo[0].fields['Name'].split(',')
    console.log("full name", fullname)

    this.setState({ ...this.state, firstname: fullname[1].trim() })
    this.setState({ ...this.state, lastname: fullname[0].trim() })
    // this.setState({...this.state, email: response.data.staffInfo[0].fields['Email'] })
    this.setState({ ...this.state, textmask: response.data.staffInfo[0].fields['Phone Number'] })
    console.log(this.state)

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

  async updateStaff() {
    console.log("This is the state", this.state)
    const { firstname,
      lastname,
      email,
      barcode,
      department,
      textmask,
      scanning,
      lastresult,
      severity,
      message,
      open } = this.state;

    const staffInformation = {
      firstname,
      lastname,
      email,
      barcode,
      department,
      textmask,
      scanning,
      lastresult,
      severity,
      message,
      open
    };
    console.log("staffInformation", staffInformation)
    let response = await axios.post('/updateStaff', staffInformation);
    this.state.message = response.data.message;
        this.state.severity = response.data.severity;
        this.setState({ ...this.state, open: true });

    if (response) {
      console.log('Login status:');

    } else {
      console.error('Login Failed!');
    }
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    console.log('here');
    this.setState({ ...this.state, open: false });
  };

  render() {
    const { classes } = this.props;
    console.log('props', this.props);
    console.log('state', this.state);

    return (

      // Step 1 : Search for Staff member to update (Scan BarCode or enter ID)
      // Step 2 : Fill in field value with their information that's retreived from Airtable API
      // Step 3 : Let the user edit the information that was added to the screen
      // Step 4 : When they submit the new information it will be sent to Airtable

      <Container className={classes.marginAutoContainer}>
        <AppBar style={{ boxShadow: "none" }} className={classes.appBar}>
          <Toolbar style={{ boxShadow: "none" }}>
            <IconButton className={classes.menuButton} onClick={this.backToMain}>
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
            <Typography variant="h6">Update Staff</Typography>
          </Toolbar>
        </AppBar>
        <br />
        <br />

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
        <br />
        <br />
        <form noValidate autoComplete="off" >
          <TextField required className={classes.root}
            id="standard-full-width"
            name="firstname"
            value={this.state.firstname}
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
            value={this.state.lastname}
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
            value={this.state.email}
            onChange={event => this.handleChange(event)}
            // style={{ width: "40%", marginBottom: "1%" }}
            placeholder="Enter email"
            label="Required"
            InputLabelProps={{
              shrink: true,
            }} />
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
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={"CH9-STICU"}>CCH9-STICU</MenuItem>
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
        <Button className={classes.root} style={{ marginTop: "1%", color: "black", backgroundColor: "#FFBA00", border: "none" }} color="primary" variant="outlined" onClick={this.updateStaff.bind(this)}>Update Staff</Button>
        <Snackbar open={this.state.open} autoHideDuration={3000} onClose={this.handleClose} key={`${this.state.vertical}`}>
          <Alert onClose={this.handleClose} severity={this.state.severity}>
            {this.state.message}
          </Alert>
        </Snackbar>
        <div>
          {(this.state.scanning) ? <Scanner onDetected={this._onDetected} /> : null}
        </div>
      </Container>
    )
  }
}

export default withStyles(styles)(UpdateStaff);