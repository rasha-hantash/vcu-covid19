import React from 'react';
import '../App.css';
import { Container, Button, IconButton } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


const useStyles = theme => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {

    },

    div: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        marginBottom: theme.spacing(2),
    }
});

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}


class ViewStaffRecords extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            staffRecord: [],
            maskRecords: [],

        }
        this.returnAddStaff = this.returnAddStaff.bind(this);
    };

    registerMaskToUser = () => {

    }

    async returnAddStaff() {
        // const = {firstname,
        //     lastname,
        //     email,
        //     barcode,
        //     department,
        //     textmask,
        //     scanning,
        //     lastresult
        // }
        this.props.history.push({
            pathname: '/staff/add/result',
            state: {
                firstname: this.props.location.state.staffRecord[0].fields.Name.split(" ")[0],
                lastname : this.props.location.state.staffRecord[0].fields.Name.split(" ")[1],
                email: this.props.location.state.staffRecord[0].fields.Email,
                barcode: this.props.location.state.staffRecord[0].fields['Staff Barcode'].text,
                department: this.props.location.state.staffRecord[0].fields['Building/Floor Code'][0] 
                        + '-' + this.props.location.state.staffRecord[0].fields['Unit Code'][0],
                textmask: this.props.location.state.staffRecord[0].fields['Phone Number'],
                scanning: false,
                lastresult: []
            }
        });
    }



    render() {

        const { classes } = this.props;
        console.log("props", this.props);
        const bull = <span className={classes.bullet}>•</span>;
        return (


            <Container style={{ marginTop: "15%" }}>
                <HideOnScroll style={{ marginBottom: "50%" }} {...this.props} >
                    <AppBar >
                        <Toolbar>

                            <IconButton onClick={this.returnAddStaff}><ArrowBackIosIcon></ArrowBackIosIcon></IconButton>
                            <div> Staff Information</div>

                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <Typography variant="h5" component="h2" style={{ paddingTop: "3%" }}>
                    Staff
                    </Typography>
                <Card className={classes.root} style={{ marginBottom: '2%', cursor: "pointer" }} variant="outlined">

                    <Typography color="textSecondary" style={{ marginLeft: "1%" }}>
                        {this.props.location.state.staffRecord[0].fields.Name}
                        <IconButton >
                            <EditIcon style={{ justifyContent: 'flexEnd' }}></EditIcon>
                        </IconButton>
                        <TableCell align="right">{this.props.location.state.staffRecord[0].fields.Email}</TableCell>
                        <TableCell align="right">{this.props.location.state.staffRecord[0].fields['Phone Number']}</TableCell>
                        <TableCell align="right">{this.props.location.state.staffRecord[0].fields['Staff Barcode'].text}</TableCell>
                        <TableCell align="right">{this.props.location.state.staffRecord[0].fields['Mask Type']}</TableCell>
                    </Typography>
                </Card>

                <Card variant="outlined" style={{ cursor: "pointer", marginBottom: "2%" }} onClick={this.registerMaskToUser}>
                    <div style={{ textAlign: 'center' }}>
                        <IconButton><AddIcon></AddIcon></IconButton>
                        <span style={{ verticalAlign: 'middle' }}>Link Staff to another mask</span>
                    </div>
                </Card>
                <Typography variant="h5" component="h2">
                    Mask
                    </Typography>
                <div>
                    {this.props.location.state.maskRecords.map((maskRecord, index) =>
                        <Card variant="outlined">
                            <div>
                                {console.log(index)}
                                {console.log(maskRecord)}
                            </div>
                            <Typography color="textSecondary" style={{ marginLeft: "1%" }}>
                                {/* {this.props.location.state.staffRecord[0].fields.Name} */}
                                <IconButton >
                                    <EditIcon style={{ justifyContent: 'flexEnd' }}></EditIcon>
                                </IconButton>
                                <TableCell align="right">{maskRecord.fields['Mask ID']}</TableCell>
                                <TableCell align="right">{maskRecord.fields['Mask Type']}</TableCell>
                                <TableCell align="right">{maskRecord.fields['Sterilize Cycles']}</TableCell>
                            </Typography>
                        </Card>

                    )}

                </div>
            </Container>
        )

    }
}

export default withStyles(useStyles)(ViewStaffRecords);