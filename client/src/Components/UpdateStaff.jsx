import React from 'react';
import '../App.css';
import {
  Container, Button, TextField, InputLabel, InputAdornment, IconButton, MenuItem, Select, Input, FormControl
} from '@material-ui/core';
import MaskedInput from 'react-text-mask';
import PropTypes from "prop-types";
import Scanner from './BarcodeScanner/Scanner'
import CenterFocusWeakOutlinedIcon from '@material-ui/icons/CenterFocusWeakOutlined';
import { withStyles } from "@material-ui/core/styles";

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
    };
    this.backToMain = this.backToMain.bind(this);
  }

  async backToMain() {
    this.props.history.push('/');
  }

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
        <IconButton onClick={this.backToMain}><ArrowBackIosIcon></ArrowBackIosIcon></IconButton>
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
        <Button className={classes.root} style={{ marginTop: "1%" }} color="primary" variant="outlined">Add Staff</Button>
        <div>
          {(this.state.scanning) ? <Scanner onDetected={this._onDetected} /> : null}
        </div>
      </Container>
    )
  }
}

export default withStyles(styles)(UpdateStaff);