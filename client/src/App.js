import React from 'react';
import './App.css';

import NewMask from './Components/NewMask';
import MaskRecord from './Components/MaskRecord';
import UpdateMask from './Components/UpdateMask';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Nav, Navbar, NavLink} from 'reactstrap';

class NavBar extends React.Component {
  render() {
    return <Navbar color="dark">
      {/* <NavbarBrand href="/newMask">New Mask</NavbarBrand> */}
      <Nav className="mr-auto">
          <NavLink href="/newMask">New Mask</NavLink>
          <NavLink href="/maskRecords">Mask Records</NavLink>
          <NavLink href="/updateMask">Update Mask</NavLink>
      </Nav>
    </Navbar>;
  }
}

class App extends React.Component {


  render() {
    return <Router>
      <Route component={NavBar} />
      <Switch>
        <Route exact path="/" component={NewMask} />
        <Route path="/newMask" component={NewMask} />
        <Route path='/maskRecords' component={MaskRecord} />
        <Route path='/updateMask' component={UpdateMask} />
      </Switch>
    </Router>;
  }
}

export default App;