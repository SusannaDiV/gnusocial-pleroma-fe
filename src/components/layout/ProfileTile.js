import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import ProfileSkeleton from '../../util/ProfileSkeleton';
import MyButton from '../../util/MyButton';
import Settings from './Settings';
// MUI stuff
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';

//Redux
import { connect } from 'react-redux';
import { uploadImage } from '../../redux/actions/userActions';

const styles = (theme) => ({
  ...theme
});

class ProfileTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      follow: '',
      isLoggedInUser: false
    }
  }

  showFollow = (option) => {
    this.setState({
      follow: option
    })
  }

  componentDidMount() {
    if (localStorage.getItem('userId') == this.props.profileId){
      console.log('profile tile check working for logged in users')
      this.setState ({isLoggedInUser: true})
    }
  }


  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated
      },
      profile
    } = this.props;

    console.log('Props in profile Tile: ', this.props.profile)
    let profileMarkup = !loading ? (
      this.state.isLoggedInUser ? (
            <div>
              <meta charSet="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
              <link rel="stylesheet" href="listnav.css" />
              <style dangerouslySetInnerHTML={{ __html: "\nhtml, body, h1, h2, h3, h4, h5 {font-family: \"Open Sans\", sans-serif}\n" }} />

              <div>
                <div className="w3-card w3-round w3-white">
                  <div className="w3-container">
                    <div className="w3-center w3-padding">
                      <div className="profile-image">
                        {
                          !profile &&
                          <>
                            <MyButton
                                tip="Edit profile picture"
                                onClick={this.handleEditPicture}
                                btnClassName="button"
                            >
                              <EditIcon style={{ fill: "white" }} />
                            </MyButton>
                            <div className="overlay"></div>
                          </>
                        }
                        <img src={profile ? profile.imageUrl : imageUrl} className="w3-circle" alt="Avatar" />
                        <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}
                        />
                      </div>
                    </div>
                    <div className="w3-center"><strong>
                      <MuiLink
                          component={Link}
                          to={`/users/${profile ? profile.handle : handle}`}
                          variant="h5"
                          className="w3-text-grey"
                      >
                        @{profile ? profile.handle : handle}
                      </MuiLink></strong>
                      {bio && <Typography variant="body2">{profile ? profile.bio : bio}</Typography>}
                      <hr />
                      {(profile && (profile.location || location)) && (
                          <Fragment>
                            <LocationOn color="primary" /> <span>{profile ? profile.location : location}</span>
                            <hr />
                          </Fragment>
                      )}
                      {(profile && (profile.website || website)) && (
                          <Fragment>
                            <LinkIcon color="primary" />
                            <a href={website} target="_blank" rel="noopener noreferrer">
                              {' '}
                              {profile ? profile.website : website}
                            </a>
                          </Fragment>
                      )}
                    </div>
                    <p onClick={this.showFollow.bind(this, 'following')} className="pointer"><i className="fa fa-arrow-right fa-fw w3-margin-right w3-text-theme" /> Following <span className="w3-right "><strong>1</strong></span></p>
                    <p onClick={this.showFollow.bind(this, 'followers')} className="pointer"><i className="fa fa-thumbs-up fa-fw w3-margin-right w3-text-theme" /> Followers <span className="w3-right "><strong>1</strong></span></p>
                  </div>
                  <div className="w3-container">
                    <div className={!profile ? 'w3-half' : ''}>
                      <button className="w3-button w3-block w3-theme w3-section" title="Message"><i className="fa fa-comment" />  Message</button>
                    </div>
                    <div className="w3-half">
                      {
                        !profile && <EditDetails />
                      }
                      {/* <EditDetails /> */}
                    </div>
                  </div>
                </div>
                {
                  this.state.follow === 'followers' &&
                  <>
                    <br />
                    <div className="w3-card w3-round w3-white follower-list">
                      <p><strong>Followers</strong></p>
                      <ul>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                      </ul>
                    </div>
                  </>
                }
                {
                  this.state.follow === 'following' &&
                  <>
                    <br />
                    <div className="w3-card w3-round w3-white follower-list">
                      <p><strong>Following</strong></p>
                      <ul>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                        <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                      </ul>
                    </div>
                  </>
                }

                <br />
                <div className="w3-card w3-round w3-white">
                  <div className="w3-container">
                    <p><strong>Statistics</strong></p>
                    <p><i className="fa fa-user fa-fw w3-margin-right w3-text-theme" /> User ID <strong>69413</strong></p>
                    <p><i className="fa fa-clock-o fa-fw w3-margin-right w3-text-theme" /> Member since <strong><span>{dayjs(profile ? profile.createdAt : createdAt).format('DD MMM YYYY')}</span></strong></p>
                    <p><i className="fa fa-calendar fa-fw w3-margin-right w3-text-theme" /> Daily average <strong>0</strong></p>
                  </div>
                </div>
                <br />
              </div>

            </div>
        ) : (
          <div>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
          <link rel="stylesheet" href="listnav.css" />
          <style dangerouslySetInnerHTML={{ __html: "\nhtml, body, h1, h2, h3, h4, h5 {font-family: \"Open Sans\", sans-serif}\n" }} />

          <div>
            <div className="w3-card w3-round w3-white">
              <div className="w3-container">
                <div className="w3-center w3-padding">
                  <div className="profile-image">
                    {
                      !profile &&
                      <>
                        <MyButton
                            tip="Edit profile picture"
                            onClick={this.handleEditPicture}
                            btnClassName="button"
                        >
                          <EditIcon style={{ fill: "white" }} />
                        </MyButton>
                        <div className="overlay"></div>
                      </>
                    }
                    <img src={profile ? profile.imageUrl : imageUrl} className="w3-circle" alt="Avatar" />
                    <input
                        type="file"
                        id="imageInput"
                        hidden="hidden"
                        onChange={this.handleImageChange}
                    />
                  </div>
                </div>
                <div className="w3-center"><strong>
                  <MuiLink
                      component={Link}
                      to={`/users/${profile ? profile.handle : handle}`}
                      variant="h5"
                      className="w3-text-grey"
                  >
                    @{profile ? profile.handle : handle}
                  </MuiLink></strong>
                  {bio && <Typography variant="body2">{profile ? profile.bio : bio}</Typography>}
                  <hr />
                  {(profile && (profile.location || location)) && (
                      <Fragment>
                        <LocationOn color="primary" /> <span>{profile ? profile.location : location}</span>
                        <hr />
                      </Fragment>
                  )}
                  {(profile && (profile.website || website)) && (
                      <Fragment>
                        <LinkIcon color="primary" />
                        <a href={website} target="_blank" rel="noopener noreferrer">
                          {' '}
                          {profile ? profile.website : website}
                        </a>
                      </Fragment>
                  )}
                </div>
                <p onClick={this.showFollow.bind(this, 'following')} className="pointer"><i className="fa fa-arrow-right fa-fw w3-margin-right w3-text-theme" /> Following <span className="w3-right "><strong>1</strong></span></p>
                <p onClick={this.showFollow.bind(this, 'followers')} className="pointer"><i className="fa fa-thumbs-up fa-fw w3-margin-right w3-text-theme" /> Followers <span className="w3-right "><strong>1</strong></span></p>
              </div>
              <div className="w3-container">
                <div className={!profile ? 'w3-half' : ''}>
                  <button className="w3-button w3-block w3-theme w3-section" title="Message"><i className="fa fa-comment" />  Message</button>
                </div>
                <div className="w3-half">
                  {
                    !profile && <EditDetails />
                  }
                  {/* <EditDetails /> */}
                </div>
              </div>
            </div>
            {
              this.state.follow === 'followers' &&
              <>
                <br />
                <div className="w3-card w3-round w3-white follower-list">
                  <p><strong>Followers</strong></p>
                  <ul>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                  </ul>
                </div>
              </>
            }
            {
              this.state.follow === 'following' &&
              <>
                <br />
                <div className="w3-card w3-round w3-white follower-list">
                  <p><strong>Following</strong></p>
                  <ul>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                    <li><a href="#"><img src="/no-img.png" alt="user" /></a></li>
                  </ul>
                </div>
              </>
            }

            <br />
            <div className="w3-card w3-round w3-white">
              <div className="w3-container">
                <p><strong>Statistics</strong></p>
                <p><i className="fa fa-user fa-fw w3-margin-right w3-text-theme" /> User ID <strong>69413</strong></p>
                <p><i className="fa fa-clock-o fa-fw w3-margin-right w3-text-theme" /> Member since <strong><span>{dayjs(profile ? profile.createdAt : createdAt).format('DD MMM YYYY')}</span></strong></p>
                <p><i className="fa fa-calendar fa-fw w3-margin-right w3-text-theme" /> Daily average <strong>0</strong></p>
              </div>
            </div>
            <br />
          </div>

        </div>
            // <Paper className={classes.paper}>
            //   <Typography variant="body2" align="center">
            //     No profile found, please login again
            //   </Typography>
            //   <div className="w3-row">
            //     <div className="w3-col m6"><button className="btn w3-button w3-block w3-theme w3-section"><Link to="/login">Login</Link></button></div>
            //     <div className="w3-col m6"><button className="btn w3-button w3-block w3-theme-d2 w3-section"><Link to="/signup">Signup</Link></button></div>
            //   </div>
              /* <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
              >
                Login
            </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/signup"
              >
                Signup
            </Button>
            </div> */
            // </Paper>
        )
    ) : (
        <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  profile: state.data.currentUser,
  user: state.user
});

const mapActionsToProps = { uploadImage };

ProfileTile.propTypes = {
  // logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(ProfileTile));
/**
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
 */
