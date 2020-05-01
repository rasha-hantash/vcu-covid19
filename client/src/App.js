import React from 'react';
import './App.css';
import AddStaff from './Components/AddStaff';
import AddStaffResult from './Components/AddStaffResult';
import AddMask from './Components/AddMask';
import AssignMaskToUser from './Components/AssignMaskToUser';
import UpdateMask from './Components/UpdateMask';
import UpdateStaff from './Components/UpdateStaff';
import ViewStaffRecords from './Components/ViewStaffRecords'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { display } from '@material-ui/system';
import { Typography } from '@material-ui/core';

const styles = {
  // root: {
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-around',
  //   overflow: 'hidden'
  // },

  paper: {
    cursor: "pointer",
    height: "50%",
    padding: "2vw",
    textAlign: "center",
    color: "#000000",
    whiteSpace: "nowrap",
    background: "#cfd8dc",
    marginTop: "2vh",
    marginBottom: "2vh",
    ['@media (max-width:600px)']: { // mobile devices
      height: '100px',
      marginTop: "1%",
      marginBottom: "1%",

    },

    ['@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait)']: //ipad
    {
      height: '200px',
      marginTop: "1%",
      marginBottom: "1px",
      fontSize: "30px",
    },
  },
  container: {
    maxWidth: "600px",
    paddingTop: "10%"
  }
};
const useStyles = makeStyles(styles);
// const classes = useStyles();
export const MaterialGrid = () => {
  const classes = useStyles();
  const history = useHistory();
  return (<Container className={classes.container}>
    <div>
      <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
          <Paper className={classes.paper} style={{ whiteSpace: 'normal' }} type='button'
            onClick={() => { history.push('/mask/add') }}>Add a new mask</Paper>
        </Grid>
        <Grid item xs={6} md={6}>
          <Paper className={classes.paper} style={{ whiteSpace: 'normal' }} type='button'
            onClick={() => { history.push('/staff/add') }}>Add a new healthcare worker</Paper>
        </Grid>
        <Grid item xs={6} md={6}>
          <Paper className={classes.paper} style={{ whiteSpace: 'normal' }} type='button'
            onClick={() => { history.push('/mask/update') }}>Update mask information</Paper>
        </Grid>
        <Grid item xs={6} md={6}>
      
          <Paper className={classes.paper} style={{ whiteSpace: 'normal' }} type='button'
            onClick={() => { history.push('/staff/update') }}>Update healthcare worker information</Paper>
        </Grid>
        
        
        <Grid item xs={6} md={6}>
          <Paper className={classes.paper} style={{ whiteSpace: 'normal' }} type='button'
            onClick={() => { history.push('/mask/assignMask') }}>Register mask to healthcare worker</Paper>
        </Grid>
      </Grid>
    </div>
  </Container>
  );
};
// class NavBar extends React.Component {
//   render() {
//       return <Staff></Staff>
//     // return <Navbar color="dark">
//     //   {/* <NavbarBrand href="/newMask">New Mask</NavbarBrand> */}
//     //   <Nav className="mr-auto">
//     //       <NavLink href="/staff">Staff</NavLink>
//     //       <NavLink href="/mask">Mask</NavLink>
//     //       <NavLink href="/department">Department</NavLink>
//     //   </Nav>
//     // </Navbar>;
//   }
// const theme = createMuiTheme({
//   palette: {
//     primary: {main: blue[700]},
//   },
//   overrides: {
//     MuiButton: {
//       raisedPrimary: {
//         color: 'white',
//       },
//     },
//   }
// });
// {/* <MuiThemeProvider theme={theme}>
//     {/* <Button variant="contained" color="primary">Primary</Button> */}

//     </MuiThemeProvider> */}

class App extends React.Component {
  render() {
    // return 

    return <Router>
      <Route />
      <Switch>
        <Route exact path="/" component={MaterialGrid} />
        <Route exact path="/staff/add" component={AddStaff} />
        <Route path="/staff/add/result" render={props => <AddStaffResult {...props}/>} />
        <Route path="/staff/records" render={props => <ViewStaffRecords {...props}/>} />
        <Route path="/staff/update" render={props => <ViewStaffRecords {...props}/>}  />
        <Route path='/mask/add' render={props => <AddMask {...props}/>} />
        {/* <Route path='/mask/update' component={UpdateMask} /> */}
        {/* <Route path='/mask/assignMask' component={AssignMaskToUser} /> */} */}
      </Switch>
    </Router>;
  }
}

export default App;