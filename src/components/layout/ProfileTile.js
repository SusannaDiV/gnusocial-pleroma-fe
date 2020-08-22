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
import axios from "axios";

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
      isLoggedInUser: false,
      profileData: []
    }
  }

  showFollow = (option) => {
    this.setState({
      follow: option
    })
  }

  getUserProfile = async (id) => {
    await axios
      .get(`https://pleroma.site/api/v1/accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        this.setState({profileData: res.data});
        console.log(
          "In profile tile to populate: ",
          this.state.profileData
        );
        
    this.render()
      })
      .catch(() => {});
  };
  componentDidMount() {
    if (this.props.isLoggedIn){
      this.setState ({isLoggedInUser: true})
    }
    console.log('Profile id in Profile Title: ', this.props.profileId)
    this.getUserProfile(this.props.profileId)
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

    const data = this.state.profileData;
    let profileMarkup =
      this.state.isLoggedInUser ? (
            <div>
              <meta charSet="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
              {/* <link rel="stylesheet" href="listnav.css" /> */}
              <style dangerouslySetInnerHTML={{ __html: "\nhtml, body, h1, h2, h3, h4, h5 {font-family: \"Open Sans\", sans-serif}\n" }} />

              <div>
                <div className="w3-card w3-round w3-white">
                  <div className="w3-container">
                    <div className="w3-center w3-padding">
                      <div className="profile-image">
                        {
                          !data &&
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
                        <img src={data ? data.avatar : imageUrl} className="w3-circle" alt="Avatar" />
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
                    <p onClick={this.showFollow.bind(this, 'following')} className="pointer"><i className="fa fa-arrow-right fa-fw w3-margin-right w3-text-theme" /> Following <span className="w3-right "><strong>{data.followers_count}</strong></span></p>
                    <p onClick={this.showFollow.bind(this, 'followers')} className="pointer"><i className="fa fa-thumbs-up fa-fw w3-margin-right w3-text-theme" /> Followers <span className="w3-right "><strong>{data.following_count}</strong></span></p>
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
                    <p><i className="fa fa-user fa-fw w3-margin-right w3-text-theme" /> User ID <strong>{data.acct}</strong></p>
                    <p><i className="fa fa-clock-o fa-fw w3-margin-right w3-text-theme" /> Member since <strong><span>{dayjs(data ? data.created_at : 0).format('DD MMM YYYY')}</span></strong></p>
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
          {/* <link rel="stylesheet" href="listnav.css" /> */}
          <style dangerouslySetInnerHTML={{ __html: "\nhtml, body, h1, h2, h3, h4, h5 {font-family: \"Open Sans\", sans-serif}\n" }} />

          <div>
            <div className="w3-card w3-round w3-white">
              <div className="w3-container">
                <div className="w3-center w3-padding">
                  <div className="profile-image">
                    {
                      !data &&
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
                    <img src={data ? data.avatar : imageUrl} className="w3-circle" alt="Avatar" />
                    <input
                        type="file"
                        id="imageInput"
                        hidden="hidden"
                        onChange={this.handleImageChange}
                    />
                  </div>
                  <div>
                    <h4>{data.display_name}</h4>
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
                <p onClick={this.showFollow.bind(this, 'following')} className="pointer"><i className="fa fa-arrow-right fa-fw w3-margin-right w3-text-theme" /> Following <span className="w3-right "><strong>{data.followers_count}</strong></span></p>
                <p onClick={this.showFollow.bind(this, 'followers')} className="pointer"><i className="fa fa-thumbs-up fa-fw w3-margin-right w3-text-theme" /> Followers <span className="w3-right "><strong>{data.following_count}</strong></span></p>
                <p onClick={this.showFollow.bind(this, 'followers')} className="pointer"><i className="fa fa-thumbs-up fa-fw w3-margin-right w3-text-theme" /> Statuses <span className="w3-right "><strong>{data.statuses_count}</strong></span></p>
              </div>
              <div className="w3-container">
                <div className={!profile ? 'w3-half' : ''}>
                  <button className="w3-button w3-block w3-theme w3-section" title="Message"><i className="fa fa-comment" />  Follow</button>
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
                <p><i className="fa fa-user fa-fw w3-margin-right w3-text-theme" /> User ID <strong>{data.acct}</strong></p>
                <p><i className="fa fa-clock-o fa-fw w3-margin-right w3-text-theme" /> Member since <strong><span>{dayjs(data ? data.created_at : 0).format('DD MMM YYYY')}</span></strong></p>
                <p><i className="fa fa-calendar fa-fw w3-margin-right w3-text-theme" /> Daily average <strong>0</strong></p>
              </div>
            </div>
            <br />
          </div>

        </div>
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
