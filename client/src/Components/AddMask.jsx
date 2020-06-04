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
    FormControl,
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

class AddMask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mask_barcode: '',
            mask_type: 'Cloth N-95',
            department: '',
            scanning: false,
            lastresult: [],
            severity: 'success',
            message: 'Success!',
            open: false
        };

        this.addNewMask = this.addNewMask.bind(this);
        this.backToMain = this.backToMain.bind(this);
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
    _logResults = () => {
        console.log("This is your result ", this.state.lastresult)
        let code = this._orderByOccurance(this.state.lastresult)[0];
        this.setState({ ...this.state, mask_barcode: code })
        
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

    async addNewMask() {
        console.log("This is the state", this.state)
        const { mask_barcode,
            mask_type,
            department, 
            severity,
            message,
            open } = this.state;

        const maskInformation = {
            mask_barcode,
            mask_type,
            department,
            severity,
            message,
            open
        };
        let response = await axios.post('/addNewMask', maskInformation);
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

    async backToMain() {
        this.props.history.push('/');
    }

    render() {
        const { classes } = this.props;
        return (
            <Container className={classes.marginAutoContainer}>
                <AppBar style={{ boxShadow: "none" }} className={classes.appBar}>
                    <Toolbar style={{ boxShadow: "none" }}>
                        <IconButton className={classes.menuButton} onClick={this.backToMain}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                        <Typography variant="h6">Add Mask</Typography>
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
                <form></form>
                <Button className={classes.root} style={{ marginTop: "1%", color: "black", backgroundColor: "#FFBA00", border: "none" }} color="primary" variant="outlined" onClick={this.addNewMask}>Add Mask</Button>
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

export default withStyles(styles)(AddMask);