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

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


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
            firstname: this.props.location.state.firstname,
            lastname: this.props.location.state.lastname,
            email: this.props.location.state.email,
            barcode: this.props.location.state.barcode,
            department: this.props.location.state.department,
            textmask: this.props.location.state.testmask,
            scanning: false,
            lastresult: []

        };
        this.backToViewStaffRecords = this.backToViewStaffRecords.bind(this);
        // this.retrieveStaffRecord = this.retrieveStaffRecord.bind(this);

    }

    async backToViewStaffRecords() {
        this.props.history.push({
            pathname: '/staff/update',
            state: {
                staffRecord: this.props.location.state.staffRecord,
                maskRecords: this.props.location.state.maskRecords
            }
        });
    }

    render() {
        const { classes } = this.props;
    console.log(this.props);
    console.log(this.state);
    
    return (
      <Container className={classes.marginAutoContainer}>
      <IconButton onClick={this.backToViewStaffRecords}><ArrowBackIosIcon></ArrowBackIosIcon></IconButton>
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
        <Button className={classes.root} style={{ marginTop: "1%" }} color="primary" variant="outlined" onClick={this.submitUpdate.bind(this)}>Add Staff</Button>
        <div>
          {(this.state.scanning) ? <Scanner onDetected={this._onDetected} /> : null}
        </div>
      </Container>
    )
    }
}

export default UpdateStaff;