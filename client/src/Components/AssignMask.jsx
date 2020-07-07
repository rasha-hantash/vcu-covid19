
import React from 'react';
import '../App.css';
import {
    Container,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Typography,
    AppBar,
    Toolbar,
    Snackbar,
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

class AssignMask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mask_barcode: '',
            staff_barcode: '',
            type: '',
            scanning: false,
            lastresult: [],
            severity: 'success',
            message: 'Success!',
            open: false
        };

        this.backToMain = this.backToMain.bind(this);
        this.assignMask = this.assignMask.bind(this);
    }

    //clears out any previous scans
    //opens camera for the scan
    _scan = (barcode) => {
        this.state.lastresult= [];
        this.setState({ scanning: !this.state.scanning })
        this.setState({ type: barcode })
    }

    //logs any detected bar code scans
    _onDetected = result => {

        this.state.lastresult.push(result.codeResult.code);
        console.log(this.state.lastresult);
        if (this.state.lastresult.length >= 20) {
            this._logResults();
            this.setState({ ...this.state, scanning: false })
            console.log("This is your state", this.state);

        }
    }

    //logs the results of the barcode scan and determines if the barcode is of
    //type mask or staff
    _logResults = () => {
        console.log("This is your result ", this.state.lastresult)
        let code = this._orderByOccurance(this.state.lastresult)[0];
        console.log("this is the type", this.state.type)
        if (this.state.type == 'staff') {
            this.setState({ ...this.state, staff_barcode: code })
        }
        if (this.state.type == 'mask') {
            this.setState({ ...this.state, mask_barcode: code })
        }

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

    async backToMain() {
        this.props.history.push('/');
    }

    //assigns mask to a staff member
    async assignMask() {

        const { mask_barcode,
            staff_barcode,
            type,
            scanning,
            lastresult,
            severity,
            message,
            open } = this.state;

        const assignmentInformation = {
            mask_barcode,
            staff_barcode,
            type,
            scanning,
            lastresult,
            severity,
            message,
            open
        };

        let response = await axios.post('/assignMaskToUser', assignmentInformation);
        this.state.message = response.data.message;
        this.state.severity = response.data.severity;
        this.setState({ ...this.state, open: true });

        if (response) {
            console.log('Login status:');

        } else {
            console.error('Login Failed!');
        }

        console.log("These are records", this.state.records);

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
        return (

            // Step 1 : Search for staff member (Scan barcode or enter ID)
            // Step 2 : Search for mask to assign (Scan mask barcode or enter ID)
            // Step 3 : User hits submit to assign the mask to the staff

            <Container className={classes.marginAutoContainer}>
                <AppBar style={{ boxShadow: "none" }} className={classes.appBar}>
                    <Toolbar style={{ boxShadow: "none" }}>
                        <IconButton className={classes.menuButton} onClick={this.backToMain}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                        <Typography variant="h6">Assign Mask</Typography>
                    </Toolbar>
                </AppBar>
                <br />
                <br />

                <form noValidate autoComplete="off" >
                    <TextField required className={classes.root}
                        id="standard-full-width"
                        name="staff_barcode"
                        value={this.state.staff_barcode}
                        onChange={event => this.handleChange(event)}
                        placeholder="Scan Staff Barcode" label="Required"
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><IconButton onClick={() => this._scan('staff')}><CenterFocusWeakOutlinedIcon>

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
                        name="mask_barcode"
                        value={this.state.mask_barcode}
                        onChange={event => this.handleChange(event)}
                        placeholder="Scan Mask Barcode" label="Required"
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><IconButton onClick={() => this._scan('mask')}><CenterFocusWeakOutlinedIcon>

                            </CenterFocusWeakOutlinedIcon></IconButton>
                            </InputAdornment>,
                        }}
                        InputLabelProps={{
                            shrink: true,

                        }}>
                    </TextField>
                </form>
                <Button className={classes.root} style={{ marginTop: "1%", color: "black", backgroundColor: "#FFBA00", border: "none" }} color="primary" variant="outlined" onClick={this.assignMask.bind(this)}>Assign</Button>
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

export default withStyles(styles)(AssignMask);