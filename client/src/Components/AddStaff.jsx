import React from 'react';
import '../App.css';
import { Container, Button, TextField, InputLabel, MenuItem,  Select,  Input } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import MaskedInput from 'react-text-mask';
import PropTypes from "prop-types";
import Scanner from './BarcodeScanner/Scanner'
import axios from 'axios';

// const useStyles = makeStyles(theme => ({
//     marginAutoContainer: {
//         display: 'flex',
//         backgroundColor: 'gold',
//         margin: 'auto 0',
//         justifyContent: 'center',
//     },
//     marginAutoItem: {
//         margin: 'auto'
//     },
//     alignItemsAndJustifyContent: {
//         width: 500,
//         height: 80,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: 'pink',
//     },
// }))
//   reateNewMask() { }
const styles = {
  marginAutoContainer: {
    display: 'flex',
    backgroundColor: 'gold',
    margin: 'auto 0',
    justifyContent: 'center',
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
};
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
      name: "",
      barcode: "",
      department: "",
      textmask: '(  )    -    ',
      scanning: false,
      lastresult: [],

    };
    // this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }
  //   handlePhoneChange(value) {
  //     if (value) {
  //       this.setState({ phone: value });
  //     }
  //   }

  ///////////logic for scanning
  _scan = () => {
    this.setState({ scanning: !this.state.scanning })
  }

  _onDetected = result => {

    this.state.lastresult.push(result.codeResult.code);
    console.log(this.state.lastresult);
    if (this.state.lastresult.length >= 20) {
      this._logResults();
      this.setState({ ...this.state, scanning: false })
      // this.state.scanning = false;
      console.log("This is your state", this.state);
      
    }
  }
  _logResults = () => {
    console.log("This is your result ", this.state.lastresult)
    let code = this._orderByOccurance(this.state.lastresult)[0];
    this.setState({ ...this.state, barcode: code })
  }

  //return the barcode that occured the most during the scan
  _orderByOccurance = (arr) =>{
    var counts = {};
    arr.forEach(function(value){
      if(!counts[value]){
        counts[value] = 0;
      }
      counts[value]++;
    });
    return Object.keys(counts).sort(function(curKey,nextKey){
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
    const { name,
    barcode,
    department,
    textmask,
    scanning,
    lastresult} = this.state;

    const staffInformation = {
      name,
      barcode,
      department,
      textmask,
      scanning,
      lastresult
    };
    console.log("Mask record", staffInformation);

    let response = await axios.post('/addNewStaff', staffInformation);
    console.log(response.data);
    this.setState({ records: response.data});

    // maybe create a this.staff.records variable
    console.log("These are records", this.state.records);

}
  render() {
    return (
      <Container maxWidth="lg">
        <form noValidate autoComplete="off" >
          <TextField required
            id="standard-full-width" 
            name="name"
            onChange={event => this.handleChange(event)} 
            style={{ width: "40%", marginBottom: "1%" }} 
            placeholder="Enter First and Last Name" 
            label="Required" 
            InputLabelProps={{
              shrink: true,
            }} />
        </form>
        <form noValidate autoComplete="off" >
          <TextField required
            id="standard-full-width" 
            name="barcode" 
            value={this.state.barcode}
            onChange={event => this.handleChange(event)} 
            style={{ width: "40%", marginBottom: "1%" }} 
            placeholder="Scan Staff Barcode" label="Required" 
            InputLabelProps={{
              shrink: true,
            }} />
          <Button color="primary" variant="outlined" onClick={this._scan}>Scan</Button>

        </form>

        <form >
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
            style={{ width: "40%", marginBottom: "1%" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"CH9-STICU"}>CCH9-STICU</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          {/* <FormHelperText>Label + placeholder</FormHelperText> */}
        </form>

        <form>
          <InputLabel required  htmlFor="formatted-text-mask-input">react-text-mask</InputLabel>
          <Input
            value={this.state.textmask}
            onChange={event => this.handleChange(event)}
            name="textmask"
            id="formatted-text-mask-input"
            inputComponent={TextMaskCustom}
            style={{ width: "40%", marginBottom: "1%" }}
          />
        </form>
        <Button color="primary" variant="outlined" onClick={this.addNewStaff.bind(this)}>Add Staff</Button>
        <div>
          {(this.state.scanning) ? <Scanner onDetected={this._onDetected} /> : null}
        </div>
      </Container>
    )

  }
}
export default withStyles(styles)(AddStaff);