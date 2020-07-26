import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';
// Redux
import { Provider, connect } from 'react-redux';
import store from './redux/store';

import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
// Components
import Navbar from './components/layout/Navbar';
import themeObject from './util/theme';
import AuthRoute from './util/AuthRoute';
// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';
import popular from './pages/popular';
import network from './pages/network';

import axios from 'axios';
import ProfileTile from './components/layout/ProfileTile';
import { Link } from 'react-router-dom';

import Store from "../src/redux/store";

const theme = createMuiTheme(themeObject);

axios.defaults.baseURL =
  'https://europe-west1-socialape-d081e.cloudfunctions.net/api';

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}
// const location = useLocation();
class App extends Component {

  componentDidMount() {
    console.log(store)
  }

  render() {
    let state = Store.getState();
    console.log(state.user)
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <div className="w3-container w3-content" style={{ maxWidth: '1200px', marginTop: '80px' }}>
                <div className="w3-row">
                  <div className="w3-col m2">
                    <div className="w3-card w3-round">
                      <div className="w3-white">
                        <Link to="/" className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-circle-o-notch fa-fw w3-margin-right" /> Public</Link>
                        <ProfileLink />
                        {/* <Link to="/users/:handle/scream/:screamId" className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-user fa-fw w3-margin-right" /> Profile</Link> */}
                        <Link to="/popular" className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-thumbs-up fa-fw w3-margin-right" /> Popular</Link>
                        <Link to="/network" className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-users fa-fw w3-margin-right" /> Network</Link>
                      </div>
                    </div>
                    <br />
                    <div className="w3-card w3-round w3-white w3-center">
                      <div className="w3-container">
                        <p><button className="w3-button w3-block w3-theme-l4">Send Invite</button></p>
                      </div>
                    </div>
                    <br />
                  </div>
                  <div className="w3-col m7">
                    <div className="w3-container">
                      <Switch>
                        <Route exact path="/" component={home} />
                        <Route exact path="/popular" component={popular} />
                        <Route exact path="/network" component={network} />
                        <AuthRoute exact path="/login" component={login} />
                        <AuthRoute exact path="/signup" component={signup} />
                        <Route exact path="/users/:handle" component={user} />
                        <Route
                          exact
                          path="/users/:handle/scream/:screamId"
                          component={user}
                        />
                      </Switch>
                    </div>
                  </div>
                  <div className="w3-col m3">
                    <ProfileTile />
                  </div>
                </div>
              </div>
              <br />
              <footer className="w3-container w3-theme-d3 w3-padding-16" />
              <footer className="w3-container w3-theme-d5">
                <p>GNUsocial.no is a social network, courtesy of peers.community. It runs on GNU social, version 1.20.5-release, available under the GNU Affero General Public License.</p>
              </footer>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;


const mapStateToProps = (state) => ({
  user: state.user
});
const ProfileLink = connect(mapStateToProps)((props) => {
  return <Link to={props.user.authenticated ? '/users/' + props.user.credentials.handle : '/login'} className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-user fa-fw w3-margin-right" /> Profile</Link>
})