import React from 'react';
import '../App.css';
import { Container, Button,  IconButton } from '@material-ui/core';
import { withStyles} from "@material-ui/core/styles";

import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


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

    constructor(props) {
        super(props);
        this.state = {
            firstname: this.props.location.state.firstname,
            lastname : this.props.location.state.lastname,
            email: this.props.location.state.email,
            barcode: this.props.location.state.barcode,
            department: this.props.location.state.department,
            textmask: this.props.location.state.testmask,
            scanning: false,
            lastresult: []
          
        };
        this.backToAddUser= this.backToAddUser.bind(this);
        this.retrieveStaffRecord = this.retrieveStaffRecord.bind(this);
        
      }
      
    async backToAddUser() {
        this.props.history.push( {pathname: '/staff/add', state: {
            firstname: this.props.location.state.firstname,
                lastname : this.props.location.state.lastname,
                email: this.props.location.state.email,
                barcode: this.props.location.state.barcode,
                department: this.props.location.state.department,
                textmask: this.props.location.state.testmask,
                scanning: false,
                lastresult: []
            }
        });
    }

    async retrieveStaffRecord() {

        const { firstname,
            lastname,
            email,
            barcode,
            department,
            textmask,
            scanning,
            lastresult } = this.props.location.state;
      
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
        
        let res = await axios.post('/retrieveRecordsFromStaffByBarcode', staffInformation);
        console.log("res in addstaffresult outside", res);
          this.props.location.state = res[0];
          this.props.location.state= res[1];
        this.props.history.push({
            pathname: '/staff/records', 
            state:{ staffRecord:res[0], maskRecords: res[1]}
            });


        
        
    }


    render() {
        const { classes } = this.props;
        console.log("props", this.props);
        console.log("this is state in reusult", this.state);
        const bull = <span className={classes.bullet}>•</span>;
        return (
            <Container style={{ marginTop: "5%" }}>
                <Card className={classes.root}>
                    <CardContent>
                        <IconButton onClick={this.backToAddUser}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                        <Typography variant="h5" component="h2">
                            User {this.props.location.state.firstname}  {this.props.location.state.lastname} created.
                        </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: "flex-end" }}>
                        <Button size="small" onClick={this.retrieveStaffRecord}>View record</Button>
                    </CardActions>
                </Card>
            </Container>
        )

    }
}

export default withStyles(useStyles)(AddStaffResult);