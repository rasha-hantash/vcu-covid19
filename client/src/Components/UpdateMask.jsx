import React from 'react';
import '../App.css';
import {
    Container,
    Button,
    Checkbox,
    TextField,
    InputLabel,
    InputAdornment,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Typography,
    AppBar,
    Toolbar,
    Snackbar
} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import Scanner from './BarcodeScanner/Scanner'
import axios from 'axios';
import CenterFocusWeakOutlinedIcon from '@material-ui/icons/CenterFocusWeakOutlined';
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

const VCUCheckbox = withStyles({
    root: {
        color: "#FFBA00",
        '&$checked': {
            color: "#FFBA00",
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

class UpdateMask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mask_barcode: '',
            department: '',
            scanning: false,
            lastresult: [],
            inc: true,
            dec: false,
            destroy: false,
            destroyReason: '',
            soiled: false,
            damaged: false,
            maxUse: false,
            severity: 'success',
            message: 'Success!',
            open: false
        };
        this.updateMask = this.updateMask.bind(this);
        this.backToMain = this.backToMain.bind(this);
    }

    _scan = () => {
        this.state.lastresult = [];
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
    async _logResults () {
        console.log("This is your result ", this.state.lastresult)
        let code = this._orderByOccurance(this.state.lastresult)[0];
        this.setState({ ...this.state, mask_barcode: code })
        let response = await axios.post('/getMaskInformation', this.state);
        console.log("response staff info", response.data.maskInfo[0].fields)
        if (response.data.maskInfo[0].fields['Sterilization Alert'] != null) {
            console.log("STERILIZATION NOT EMPTY")
            // res.status(200).send({ message: 'Mask has reached MAX cycle use. Please destroy mask', severity: 'error' });
            this.setState({...this.state, inc: false, maxUse: true, destroy: true })
        }
  
        

        // this.setState({ ...this.state, firstname: fullname[1].trim() })
        // this.setState({ ...this.state, lastname: fullname[0].trim() })
        // // this.setState({...this.state, email: response.data.staffInfo[0].fields['Email'] })
        // this.setState({ ...this.state, textmask: response.data.staffInfo[0].fields['Phone Number'] })
        // console.log(this.state)
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


    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        });
        console.log(this.state);
    };

    handleChangeCheckbox = (event) => {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
        console.log(this.state)
    };

    async backToMain() {
        this.props.history.push('/');
    }
    async updateMask() {
        const { mask_barcode,
            department,
            scanning,
            lastresult,
            inc,
            dec,
            destroy,
            destroyReason,
            soiled,
            damaged,
            maxUse,
            severity,
            message,
            open
        } = this.state;

        const maskInformation = {
            mask_barcode,
            department,
            scanning,
            lastresult,
            inc,
            dec,
            destroy,
            destroyReason,
            soiled,
            damaged,
            maxUse,
            severity,
            message,
            open
        };
        //if user selects destroy mask but doesnt select a reason return a message
        let missingReason = false;
        console.log("Mask information", maskInformation)
        if (maskInformation.destroy) {
            if (maskInformation.soiled == false
                && maskInformation.damaged == false
                && maskInformation.maxUse == false) {
                this.state.severity = "error"
                this.state.message = "Please select a reason for destroying a mask"
                this.setState({ ...this.state, open: true });
                missingReason = true;
            }
        } if (!maskInformation.destroy) {
            // if user selects reason to destroy mask but does not select Destroy mask send a message
            if (maskInformation.soiled || maskInformation.damaged || maskInformation.maxUse) {
                this.state.severity = "error"
                this.state.message = "Please select Destroy Mask if you intend to destroy the mask"
                this.setState({ ...this.state, open: true });
                missingReason = true;
            }
        } if (missingReason == false) {
            if (maskInformation.soiled) {
                maskInformation.destroyReason = "Soiled"
            }
            if (maskInformation.damaged) {
                maskInformation.destroyReason = "Damaged"
            }
            if (maskInformation.maxUse) {
                maskInformation.destroyReason = "Max Use"
            }
            //otherwise update the mask
            let response = await axios.post('/updateMask', maskInformation);
            this.state.message = response.data.message;
            this.state.severity = response.data.severity;
            this.setState({ ...this.state, open: true });
            if(this.state.severity == 'error'){
                this.setState({...this.state, inc: false, maxUse: true, destroy: true })
            }
        }

    }

    // closes snackbar if user clicks away
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ ...this.state, open: false });
    };

    render() {
        const { classes } = this.props;
        return (

            // Step 1 : Search for mask member to update (Scan BarCode or enter ID)
            // Step 2 : Fill in field value with their information that's retreived from Airtable API
            // Step 3 : Let the user edit the information that was added to the screen
            // Step 4 : When they submit the new information it will be sent to Airtable

            <Container className={classes.marginAutoContainer}>
                <AppBar style={{ boxShadow: "none" }} className={classes.appBar}>
                    <Toolbar style={{ boxShadow: "none" }}>
                        <IconButton className={classes.menuButton} onClick={this.backToMain}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                        <Typography variant="h6">Update Mask</Typography>
                    </Toolbar>
                </AppBar>
                <br />
                <br />

                <form noValidate autoComplete="off" >
                    <TextField required className={classes.root}
                        id="standard-full-width"
                        name="mask_barcode"
                        value={this.state.mask_barcode}
                        onChange={event => this.handleChange(event)}
                        // style={{ width: "40%", marginBottom: "1%" }}
                        placeholder="Scan Mask Barcode" label="Required"
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

                <FormControl className={classes.root} noValidate autoComplete="off">
                    <InputLabel required shrink id="demo-simple-select-placeholder-label-label">Unit Code</InputLabel>
                    <Select
                        name="department"
                        value={this.state.department}
                        onChange={event => this.handleChange(event)}
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        displayEmpty>
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
                </FormControl>
                <div>
                    <FormControl component="fieldset" className={classes.root}>
                        <FormLabel component="legend">Mask Clean Status</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<VCUCheckbox checked={this.state.inc} name="inc" onChange={this.handleChangeCheckbox} />}
                                label="Increment Cleaning Cycle"
                            />
                            <FormControlLabel
                                control={<VCUCheckbox checked={this.state.dec} name="dec" onChange={this.handleChangeCheckbox} />}
                                label="Decrement Cleaning Cycle"
                            />
                            <FormControlLabel
                                control={<VCUCheckbox checked={this.state.destroy} name="destroy" onChange={this.handleChangeCheckbox} />}
                                label="Destroy Mask"
                            />
                            <span style={{ color: 'grey', textAlign: 'left' }}>If destroyed, please select the reason*</span>
                            <FormControlLabel style={{ marginLeft: "3%" }}
                                control={<VCUCheckbox checked={this.state.soiled} name="soiled" onChange={this.handleChangeCheckbox} />}
                                label="Soiled"
                            />
                            <FormControlLabel style={{ marginLeft: "3%" }}
                                control={<VCUCheckbox checked={this.state.damaged} name="damaged" onChange={this.handleChangeCheckbox} />}
                                label="Damaged"
                            />
                            <FormControlLabel style={{ marginLeft: "3%" }}
                                control={<VCUCheckbox checked={this.state.maxUse} name="maxUse" onChange={this.handleChangeCheckbox} />}
                                label="Max Use"
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <Button className={classes.root} style={{ marginTop: "1%", color: "black", backgroundColor: "#FFBA00", border: "none" }}
                    color="primary" variant="outlined" onClick={this.updateMask.bind(this)}>Update Mask
                </Button>
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

export default withStyles(styles)(UpdateMask);