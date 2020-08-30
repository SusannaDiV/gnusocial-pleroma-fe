import React, { Component } from 'react';
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
import publicHome from './pages/publicHome';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';
import favorites from './pages/favorites';
import messages from './pages/messages';

import axios from 'axios';
import { Link } from 'react-router-dom';

import Store from "../src/redux/store";

const theme = createMuiTheme(themeObject);

axios.defaults.baseURL = '/';

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

  state = {
    profile: []
  };

  componentDidMount() {
    console.log(store)
    this.getCurrentUserProfile(localStorage.getItem('userId'));
  }

  getCurrentUserProfile = async (id) => {
    await axios
      .get(`https://pleroma.site/api/v1/accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        this.setState({ profile: res.data });
      })
      .catch(() => {});
  };

  render() {
    let state = Store.getState();
    console.log('User from state: ', this.state.profile)
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar profile={this.state.profile}/>
            <div className="container">
              <div className="w3-container w3-content" style={{ maxWidth: '1200px', marginTop: '80px' }}>
                <div className="w3-row">
                  <div className="w3-col m2">
                    <div className="w3-card w3-round">
                      <div className="w3-white">
                        <Link to={`/public`} className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-circle-o-notch fa-fw w3-margin-right" /> Public</Link>
                        <ProfileLink profile={this.state.profile} />
                        <Link to="/favorites" className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-thumbs-up fa-fw w3-margin-right" /> Favorites</Link>
                        <Link to="/messages" className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-envelope fa-fw w3-margin-right" /> Messages</Link>
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
                  <div className="w3-col m10">
                    <div className="w3-container">
                      <Switch>
                        <Route exact path="/" component={home} />
                        <Route exact path="/public" component={publicHome} />
                        <Route exact path="/favorites" component={favorites} />
                        <Route exact path="/messages" component={messages} />
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
  return <Link to={localStorage.getItem("userId") == props.profile.id ? '/users/' + props.profile.username + '/scream/' + props.profile.id : '/login'} className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-user fa-fw w3-margin-right" /> Profile</Link>
})
