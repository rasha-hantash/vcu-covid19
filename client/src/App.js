import React from 'react';
import './App.css';
import AddStaff from './Components/AddStaff';
import AddMask from './Components/AddMask';
import UpdateMask from './Components/UpdateMask';
import UpdateStaff from './Components/UpdateStaff';
import AssignMask from './Components/AssignMask';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Card, CardContent, AppBar, Toolbar, Typography, CssBaseline, useScrollTrigger, Box
} from '@material-ui/core';

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
    background: '#FFBA00',
    textAlign: "center",
    margin: '0 auto',
    borderRadius: '20px',
    // palette:  { 
    //   text: {
    //       primary: "#ffffff",
    //   }
    // }

  },
  appBar: {
    background: '#FFBA00',
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
          <Typography style={{ margin: '0 auto', textAlign: 'center', fontSize: "25px" }} variant="h6">VCU Mask Interface</Typography>
        </Toolbar>
      </AppBar>
      <Card onClick={() => { history.push('/addStaff') }} className={classes.card}>
        <CardContent style={{ marginTop: '5%' }}>
          <div style={{ fontWeight: 'bolder', fontSize: '20px' }}>Add Staff</div>
        </CardContent>
      </Card>
      <Card onClick={() => { history.push('/updateStaff') }} className={classes.card}>
        <CardContent style={{ marginTop: '5%' }}>
          <div style={{ fontWeight: 'bolder', fontSize: '20px' }}>Update Staff</div>
        </CardContent>
      </Card>
      <Card onClick={() => { history.push('/addMask') }} className={classes.card}>
        <CardContent style={{ marginTop: '5%' }}>
          <div style={{ fontWeight: 'bolder', fontSize: '20px' }}>Add Mask</div>
        </CardContent>
      </Card>
      <Card onClick={() => { history.push('/updateMask') }} className={classes.card}>
        <CardContent style={{ marginTop: '5%' }}>
          <div style={{ fontWeight: 'bolder', fontSize: '20px' }}>Update Mask</div>
        </CardContent>
      </Card>
      <Card onClick={() => { history.push('/assignMask') }} className={classes.card}>
        <CardContent style={{ marginTop: '5%' }}>
          <div style={{ fontWeight: 'bolder', fontSize: '20px' }}>Assign Mask</div>
        </CardContent>
      </Card>
    </Container>
  );
};

class App extends React.Component {
  render() {
    return <Router>
      <Switch>
        <Route exact path="/" component={MaterialGrid} />
        <Route exact path="/addStaff" component={AddStaff} />
        <Route path='/addMask' component={AddMask} />
        <Route path='/updateMask' component={UpdateMask} />
        <Route path='/updateStaff' component={UpdateStaff} />
        <Route path='/assignMask' component={AssignMask} />
      </Switch>
    </Router>;
  }
}

export default App;