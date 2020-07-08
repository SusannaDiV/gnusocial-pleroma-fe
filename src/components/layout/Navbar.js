import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logo from './gnu-social-logo.png';
import Notifications from './Notifications';
// Redux
import { logoutUser } from '../../redux/actions/userActions';
class Navbar extends Component {
  handleLogout = () => {
    this.props.logoutUser();
  };
  render() {
    const { authenticated } = this.props;
    return (
      <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <link rel="stylesheet" href="listnav.css" />
      <style dangerouslySetInnerHTML={{__html: "\nhtml, body, h1, h2, h3, h4, h5 {font-family: \"Open Sans\", sans-serif}\n" }} />

      <div className="w3-top">
      <div className="w3-bar w3-theme-l2 w3-left-align w3-large">
        <a component={Link} to="/" class="w3-bar-item w3-button w3-padding-medium w3-theme-l2"><i class="w3-margin-right"></i><img src={logo} className="GNU-social-logo" alt="logo" width="105" height="33"/></a>
        <a href="#" className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Home"><i className="fa fa-home" /></a>
        <a href="#" className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Account Settings"><i className="fa fa-user" /></a>
        <a component={Link} to="/popular" href="#" className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Messages"><i className="fa fa-envelope" /></a>
        <Notifications />
        <div className="w3-dropdown-hover w3-hide-small w3-right">
          <button className="w3-button w3-padding-large" title="My Account"><i />  
            <img src="E:\HTML\a.jpg" className="w3-circle" style={{height: '23px', width: '23px'}} alt="Avatar" />
          </button>  
          <div className="w3-dropdown-content head_menu  w3-bar-block" style={{width: '100px'}}><h4> </h4>
            <button className="w3-button w3-block w3-theme-l2 w3-section" title="Decline"><i className="fa fa-wrench" /> Settings</button>
            <hr />
            <button className="w3-button w3-block w3-theme-d2 w3-section" title="Decline"><i className="fa fa-sign-out" /> Logout</button>
          </div>
        </div>
        <a href="#" className="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white" title="Search"><i className="fa fa-search" /></a>
      </div>
    </div>
    </div>
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
