import React from 'react';
import '../App.css';
import { Container, Button, TextField, InputLabel, InputAdornment, IconButton, MenuItem, Select, Input, FormControl } from '@material-ui/core';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import MaskedInput from 'react-text-mask';
import PropTypes from "prop-types";
import Scanner from './BarcodeScanner/Scanner'
import axios from 'axios';
import CenterFocusWeakOutlinedIcon from '@material-ui/icons/CenterFocusWeakOutlined';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


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
        marginBottom: 12,
    },
});

class AddStaffResult extends React.Component {

    render() {
        const { classes } = this.props;
        console.log("props", this.props);
        const bull = <span className={classes.bullet}>•</span>;
        return (
            <Container style={{marginTop: "5%"}}>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Word of the Day
                    </Typography>
                        <Typography variant="h5" component="h2">
                            User {this.props.location.state.firstname}  {this.props.location.state.firstname} created.
                        </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: "flex-end"}}>
                        <Button   size="small">View record</Button>
                    </CardActions>
                </Card>
            </Container>
        )

    }
}

export default withStyles(useStyles)(AddStaffResult);