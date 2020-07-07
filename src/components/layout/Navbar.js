import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import Notifications from './Notifications';
// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// Icons
import HomeIcon from '@material-ui/icons/Home';
import MailIcon from '@material-ui/icons/Mail';
import PersonIcon from '@material-ui/icons/Person';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
// Redux
import { logoutUser } from '../../redux/actions/userActions';
class Navbar extends Component {
  handleLogout = () => {
    this.props.logoutUser();
  };
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon />
                </MyButton>
                <MyButton tip="Account Settings">
                  <PersonIcon />
                </MyButton>
                <MyButton tip="Messages">
                  <MailIcon />
                </MyButton>
                <MyButton tip="Logout" onClick={this.handleLogout}>
                  <KeyboardReturn color="primary" />
                </MyButton>
              </Link>
              <Notifications />
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  logoutUser: PropTypes.func.isRequired
});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(Navbar);
