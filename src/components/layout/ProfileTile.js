import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Redux
import { logoutUser } from '../../redux/actions/userActions';
class ProfileTile extends Component {
  handleLogout = () => {
    this.props.logoutUser();
  };
  render() {
    return (
      <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <link rel="stylesheet" href="listnav.css" />
      <style dangerouslySetInnerHTML={{__html: "\nhtml, body, h1, h2, h3, h4, h5 {font-family: \"Open Sans\", sans-serif}\n" }} />

      <div className="w3-col m3">
              <div className="w3-card w3-round w3-white">
                <div className="w3-container">
                  <p className="w3-center"><img src="E:\HTML\profile.png" className="w3-circle" style={{height: '106px', width: '106px'}} alt="Avatar" /></p>
                  <p className="w3-center"><strong>susannadiv</strong></p>
                  <hr />
                  <p><i className="fa fa-arrow-right fa-fw w3-margin-right w3-text-theme" /> Following <span className="w3-right "><strong>1</strong></span></p>
                  <p><i className="fa fa-thumbs-up fa-fw w3-margin-right w3-text-theme" /> Followers <span className="w3-right "><strong>1</strong></span></p>
                </div>
                <div className="w3-container">
                  <div className="w3-half ">
                    <button className="w3-button w3-block w3-theme w3-section" title="Message"><i className="fa fa-comment" />  Message</button>
                  </div>
                  <div className="w3-half">
                    <button className="w3-button w3-block w3-theme-d2 w3-section" title="Decline"><i className="fa fa-pencil" />  Edit</button>
                  </div>
                </div>
              </div>
              <br />
              <div className="w3-card w3-round w3-white">
                <div className="w3-container">
                  <p><strong>Statistics</strong></p>
                  <p><i className="fa fa-user fa-fw w3-margin-right w3-text-theme" /> User ID <strong>69413</strong></p>
                  <p><i className="fa fa-clock-o fa-fw w3-margin-right w3-text-theme" /> Member since <strong>11 Mar 2020</strong></p>
                  <p><i className="fa fa-calendar fa-fw w3-margin-right w3-text-theme" /> Daily average <strong>0</strong></p>
                </div>
              </div>
              <br />
            </div>
    </div>
    );
  }
}

ProfileTile.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  logoutUser: PropTypes.func.isRequired
});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(ProfileTile);
