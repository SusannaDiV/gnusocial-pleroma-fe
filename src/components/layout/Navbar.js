import React, { Component } from "react";
import Redirect from "react-router-dom/es/Redirect";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import logo from "../../images/gnu-social-logo.png";
import Notifications from "./Notifications";
import SearchInput from "./SearchInput";
import { logoutUser } from "../../redux/actions/userActions";
import { Link } from "react-router-dom";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
      profile: [],
      imageUrl: "",
    };
  }
  handleLogout = () => {
    this.props.logoutUser();
    window.location.reload();
  };
  render() {
    const isLoggedIn = localStorage.getItem("tokenStr") != null;
    if (this.state.isLoggedIn) {
      return <Redirect to={{ pathname: "/" }} />;
    }
    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link rel="stylesheet" href="listnav.css" />
        <style
          dangerouslySetInnerHTML={{
            __html:
              '\nhtml, body, h1, h2, h3, h4, h5 {font-family: "Open Sans", sans-serif}\n',
          }}
        />

        <div className="w3-top">
          <div className="w3-bar w3-theme-l2 w3-left-align w3-large">
            <Link to="/" className="w3-bar-item w3-padding-medium w3-theme-l2">
              <i className="w3-margin-right"></i>
              <img
                src={logo}
                className="GNU-social-logo"
                alt="logo"
                width="105"
                height="33"
              />
            </Link>
            <Link
              to="/"
              className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white"
            >
              <i className="fa fa-home" />
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/favorites"
                  className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white"
                >
                  <i className="fa fa-thumbs-up" />
                </Link>
                <Link
                  to="/messages"
                  className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white"
                >
                  <i className="fa fa-envelope" />
                </Link>
                <Notifications />
              </>
            )}

            <div className="w3-dropdown-hover w3-hide-small w3-right">
              {isLoggedIn ? (
                <>
                  <Link
                    className="w3-button w3-padding-large"
                    title="My Account"
                    to={`/users/${this.props.profile.username}/scream/${this.props.profile.id}`}
                  >
                    <i />
                    <img
                      src={
                        this.props.profile
                          ? this.props.profile.avatar
                          : this.state.imageUrl
                      }
                      className="w3-circle"
                      style={{ height: "23px", width: "23px" }}
                      alt="Avatar"
                    />
                  </Link>
                  <div
                    className="w3-dropdown-content head_menu  w3-bar-block"
                    style={{ width: "100px" }}
                  >
                    <h4> </h4>
                    <Link
                      to={`/users/${this.props.profile.username}/scream/${this.props.profile.id}`}
                      className="w3-button w3-block w3-theme-l2 w3-section"
                    >
                      <i className="fa fa-user" /> Profile
                    </Link>
                    <hr />
                    <button
                      onClick={this.handleLogout}
                      className="w3-button w3-block w3-theme-d2 w3-section"
                      title="Decline"
                    >
                      <i className="fa fa-sign-out" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white"
                >
                  Login
                </Link>
              )}
            </div>
            <div
              className={
                this.state.showSearch
                  ? "w3-right header-search active"
                  : "w3-right header-search"
              }
            >
              <SearchInput />
              <button
                onClick={() => {
                  this.setState({ showSearch: !this.state.showSearch });
                }}
                className="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white"
                title="Search"
              >
                <i className="fa fa-search" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user,
  logoutUser: PropTypes.func.isRequired,
});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(Navbar);
