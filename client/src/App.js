import React from 'react';
import './App.css';
import AddStaff from './Components/AddStaff';
import AddMask from './Components/AddMask';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {Container , Card, CardContent, AppBar, Toolbar, Typography, CssBaseline, useScrollTrigger, Box}from '@material-ui/core';

const styles = {

  container: {
    paddingTop: "20%",
    cursor: "pointer",
    margin: '0 auto',
    textAlign: 'center '
  },
  card: {
    marginBottom: "5%",
    padding: "3%",
    background : '#FFBA00',
    textAlign: "center",
    margin: '0 auto',
    borderRadius:'20px',
    // palette:  { 
    //   text: {
    //       primary: "#ffffff",
    //   }
    // }
    
  },
  appBar: {
    background : '#FFBA00',
    color: 'black'
    
    
  }
};
const useStyles = makeStyles(styles);
export const MaterialGrid = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    
    <Container className={classes.container}>
    <AppBar className={classes.appBar}> 
          <Toolbar>
            <Typography style={ {margin: '0 auto', textAlign: 'center', fontSize:"25px"}} variant="h6">N-95 Interface</Typography>
          </Toolbar>
        </AppBar>
    <Card  onClick={() => { history.push('/addStaff') }} className={classes.card}>
      <CardContent style={{marginTop: '5%'}}>
          <div style={{fontWeight:'bolder'}}>Add a new staff</div>
      </CardContent>
    </Card>
    <Card onClick={() => { history.push('/updateStaff') }} className={classes.card}>
      <CardContent style={{marginTop: '5%'}}>
          <div style={{fontWeight:'bolder'}}>Update a staff</div>
      </CardContent>
    </Card>
    <Card onClick={() => { history.push('/addMask') }} className={classes.card}>
      <CardContent style={{marginTop: '5%'}}>
          <div style={{fontWeight:'bolder'}}>Add a new mask</div>
      </CardContent>
    </Card>
    <Card onClick={() => { history.push('/updateMask') }} className={classes.card}>
      <CardContent style={{marginTop: '5%'}}>
          <div style={{fontWeight:'bolder'}}>Update a mask</div>
      </CardContent>
    </Card>
    <Card onClick={() => { history.push('/registerMaskToUser') }} className={classes.card}>
      <CardContent style={{marginTop: '5%'}}>
          <div style={{fontWeight:'bolder'}}>Register a staff to a mask</div>
      </CardContent>
    </Card>
  </Container>
  );
};

class App extends React.Component {
  render() {
    return <Router>
      <Route />
      <Switch>
        <Route exact path="/" component={MaterialGrid} />
        <Route exact path="/addStaff" component={AddStaff} />
        <Route path='/addMask' component={AddMask}/>
      </Switch>
    </Router>;
  }
}

export default App;