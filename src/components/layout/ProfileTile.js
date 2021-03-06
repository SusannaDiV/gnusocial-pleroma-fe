import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";
// MUI stuff
import Typography from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import axios from "axios";

//Redux
import { connect } from "react-redux";
import { uploadImage } from "../../redux/actions/userActions";

const styles = (theme) => ({
  ...theme,
});

class ProfileTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isfollowed: "",
      isBlocked: "",
      isMute: "",
      isLoggedInUser: false,
      profileData: [],
      followers: [],
      followings: [],
      showFollowers: false,
      showFollowings: false,
    };
  }

  showUserFollowers = () => {
    this.setState({
      showFollowers: !this.state.showFollowers,
      showFollowings: false
    });
  };

  showUserFollowings = () => {
    this.setState({
      showFollowings: !this.state.showFollowings,
      showFollowers: false
    })
  };

  showFollow = (option) => {
    this.setState({
      isfollowed: option,
    });
  };

  showBlock = (option) => {
    this.setState({
      isBlocked: option,
    });
  };

  showMute = (option) => {
    this.setState({
      isMute: option,
    });
  };

  getUserProfile = async (id) => {
    await axios
      .get(`https://pleroma.site/api/v1/accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        this.setState({ profileData: res.data });
        console.log("In profile tile to populate: ", this.state.profileData);

        this.render();
      })
      .catch(() => {});
  };
  followUser = async () => {
    await axios
      .post(
        `https://pleroma.site/api/v1/accounts/${this.props.profileId}/follow`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
          },
        }
      )
      .then((res) => {
        this.showFollow(true);
        console.log(
          "In profile tile to check is followed: ",
          this.state.isfollowed
        );

        this.render();
      })
      .catch(() => {});
  };
  unfollowUser = async () => {
    await axios
      .post(
        `https://pleroma.site/api/v1/accounts/${this.props.profileId}/unfollow`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
          },
        }
      )
      .then((res) => {
        this.showFollow(false);
        console.log(
          "In profile tile to check is followed: ",
          this.state.isfollowed
        );

        this.render();
      })
      .catch(() => {});
  };

  blockUser = async () => {
    await axios
        .post(
            `https://pleroma.site/api/v1/accounts/${this.props.profileId}/block`,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
              },
            }
        )
        .then((res) => {
          this.showBlock(true);
          this.render();
        })
        .catch(() => {});
  };

  unBlockUser = async () => {
    await axios
        .post(
            `https://pleroma.site/api/v1/accounts/${this.props.profileId}/unblock`,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
              },
            }
        )
        .then((res) => {
          this.showBlock(false);
          this.render();
        })
        .catch(() => {});
  };

  muteUser = async () => {
    await axios
        .post(
            `https://pleroma.site/api/v1/accounts/${this.props.profileId}/mute`,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
              },
            }
        )
        .then((res) => {
          this.showMute(true);
          this.render();
        })
        .catch(() => {});
  };

  unMuteUser = async () => {
    await axios
        .post(
            `https://pleroma.site/api/v1/accounts/${this.props.profileId}/unmute`,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
              },
            }
        )
        .then((res) => {
          this.showMute(false);
          this.render();
        })
        .catch(() => {});
  };

  getUserFollowers = async () => {
    await axios
      .get(
        `https://pleroma.site/api/v1/accounts/${this.props.profileId}/followers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
          },
        }
      )
      .then((res) => {
        this.setState({ followers: res.data });
        console.log("Followers: ", this.state.followers);
        this.lookUpForCurrentUserInFollowers(localStorage.getItem("userId"));
        this.render();
      })
      .catch(() => {});
  };
  getUserFollowings = async () => {
    await axios
      .get(
        `https://pleroma.site/api/v1/accounts/${this.props.profileId}/following`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
          },
        }
      )
      .then((res) => {
        this.setState({ followings: res.data });
        console.log("Followings: ", this.state.followings);
        this.lookUpForCurrentUserInFollowers(localStorage.getItem("userId"));
        this.render();
      })
      .catch(() => {});
  };
  lookUpForCurrentUserInFollowers = async (id) => {
    const followerList = this.state.followers;
    if (followerList != null) {
      followerList.map((follower) =>
        follower.id === id ? this.showFollow(true) : this.showFollow(false)
      );
    }
    console.log("Follow state: ", this.state.isfollowed);
  };
  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.setState({ isLoggedInUser: true });
    }
    console.log("Profile id in Profile Title: ", this.props.profileId);
    this.getUserProfile(this.props.profileId);
    this.getUserFollowers();
    this.getUserFollowings();
  }
  componentDidUpdate(prevProps) {
    if (this.props.profileId !== prevProps.profileId) {
      if (this.props.isLoggedIn) {
        this.setState({ isLoggedInUser: true });
      }
      console.log("Profile id in updated Profile Title: ", this.props.profileId);
      this.getUserProfile(this.props.profileId);
      this.getUserFollowers();
      this.getUserFollowings();
    }
  }
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  render() {
    const {
      user: {
        credentials: { imageUrl, bio, website, location }
      },
      profile,
    } = this.props;

    const data = this.state.profileData;
    const followersList = this.state.followers;
    // console.log('Followers List to show: ', followersList)
    const dataToPopulateInFollowersList = followersList &&
      followersList.map((follower) => <li> <Link to={`/users/${follower.username}/scream/${follower.id}`}><strong>{follower.display_name}</strong></Link></li>)

  
    const followingsList = this.state.followings;
    // console.log('Followings List to show: ', followingsList)
    const dataToPopulateInFollowingList = followingsList &&
      followingsList.map((following) => <li><Link to={`/users/${following.username}/scream/${following.id}`}><strong>{following.acct}</strong></Link></li>)

    let profileMarkup = this.state.isLoggedInUser ? (
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
        <style
          dangerouslySetInnerHTML={{
            __html:
              '\nhtml, body, h1, h2, h3, h4, h5 {font-family: "Open Sans", sans-serif}\n',
          }}
        />

        <div>
          <div className="w3-card w3-round w3-white">
            <div className="w3-container">
              <div className="w3-center w3-padding">
                <div className="profile-image">
                  { data && ( <></> )}
                  <img
                    src={data ? data.avatar : imageUrl}
                    className="w3-circle"
                    alt="Avatar"
                  />
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
                <MuiLink
                    component={Link}
                    to={`/users/${data.username}/scream/${data.id}`}
                    className="w3-text-grey"
                  >
                    @{data.username}
                  </MuiLink>
              </div>
              <div className="w3-center">
                {data && (
                  <Typography variant="body2">
                    {data ? data.note : bio}
                  </Typography>
                )}
                <hr />
                {profile && (profile.location || location) && (
                  <Fragment>
                    <LocationOn color="primary" />{" "}
                    <span>{profile ? profile.location : location}</span>
                    <hr />
                  </Fragment>
                )}
                {profile && (profile.website || website) && (
                  <Fragment>
                    <LinkIcon color="primary" />
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {" "}
                      {profile ? profile.website : website}
                    </a>
                  </Fragment>
                )}
              </div>
              <p onClick={this.showUserFollowings} className="pointer">
                <i className="fa fa-arrow-right fa-fw w3-margin-right w3-text-theme" />{" "}
                Following{" "}
                <span className="w3-right ">
                  <strong>{data.following_count}</strong>
                </span>
              </p>
              <p onClick={this.showUserFollowers}>
                <i className="fa fa-users fa-fw w3-margin-right w3-text-theme" />{" "}
                Followers{" "}
                <span className="w3-right ">
                  <strong>{data.followers_count}</strong>
                </span>
              </p>
              <p
                onClick={this.showFollow.bind(this, "followers")}
                className="pointer"
              >
                <i className="fa fa-archive fa-fw w3-margin-right w3-text-theme" />{" "}
                Statuses{" "}
                <span className="w3-right ">
                  <strong>{data.statuses_count}</strong>
                </span>
              </p>
            </div>
            <div className="w3-container">
              <div className={!profile ? "w3-half" : ""}>
                <Link to="/favorites" title="Favorites" className="w3-button w3-block w3-theme w3-section">
                  <i className="fa fa-heart" /> Favorites
                </Link>
              </div>
              <div className="w3-half">
                {!profile && <EditDetails  />}
              </div>
            </div>
          </div>
          <br />
          {this.state.showFollowers && (
            <div>
              <div className="w3-card w3-round w3-white">
                <div className="w3-container">
                  <p>
                    <strong>Followers</strong>
                      <ul>
                        {dataToPopulateInFollowersList}
                      </ul>
                  </p>
                </div>
              </div>
              <br />
            </div>
          )}
          {this.state.showFollowings && (
            <div>
              <div className="w3-card w3-round w3-white">
                <div className="w3-container">
                  <p>
                    <strong>Following</strong>
                    {this.state.showFollowings && (
                      <ul>
                        {dataToPopulateInFollowingList}
                      </ul>
                    )}
                  </p>
                </div>
              </div>
              <br />
            </div>
          )}
          <div className="w3-card w3-round w3-white">
            <div className="w3-container">
              <p>
                <strong>Statistics</strong>
              </p>
              <p>
                <i className="fa fa-user fa-fw w3-margin-right w3-text-theme" />{" "}
                User ID <strong>{data.acct}</strong>
              </p>
              <p>
                <i className="fa fa-clock-o fa-fw w3-margin-right w3-text-theme" />{" "}
                Member since{" "}
                <strong>
                  <span>
                    {dayjs(data ? data.created_at : 0).format("DD MMM YYYY")}
                  </span>
                </strong>
              </p>
            </div>
          </div>
          <br />
        </div>
      </div>
    ) : (
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
        <style
          dangerouslySetInnerHTML={{
            __html:
              '\nhtml, body, h1, h2, h3, h4, h5 {font-family: "Open Sans", sans-serif}\n',
          }}
        />

        <div>
          <div className="w3-card w3-round w3-white">
            <div className="w3-container">
              <div className="w3-center w3-padding">
                <div className="profile-image">
                  {!data && ( <></> )}
                  <img
                    src={data ? data.avatar : imageUrl}
                    className="w3-circle"
                    alt="Avatar"
                  />
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
                <MuiLink
                    component={Link}
                    to={`/users/${data.username}/scream/${data.id}`}
                    className="w3-text-grey"
                  >
                    @{data.username}
                  </MuiLink>
              </div>
              <div className="w3-center">
                {data && (
                  <Typography variant="body2">
                    {data ? data.note : bio}
                  </Typography>
                )}
                <hr />
                {profile && (profile.location || location) && (
                  <Fragment>
                    <LocationOn color="primary" />{" "}
                    <span>{profile ? profile.location : location}</span>
                    <hr />
                  </Fragment>
                )}
                {profile && (profile.website || website) && (
                  <Fragment>
                    <LinkIcon color="primary" />
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {" "}
                      {profile ? profile.website : website}
                    </a>
                  </Fragment>
                )}
              </div>
              <p
                onClick={this.showUserFollowings}
                className="pointer"
              >
                <i className="fa fa-arrow-right fa-fw w3-margin-right w3-text-theme" />{" "}
                Following{" "}
                <span className="w3-right ">
                  <strong>{data.following_count}</strong>
                </span>
              </p>
              <p onClick={this.showUserFollowers} >
                <i className="fa fa-users fa-fw w3-margin-right w3-text-theme" />{" "}
                Followers{" "}
                <span className="w3-right ">
                  <strong>{data.followers_count}</strong>
                </span>
              </p>
              <p
                onClick={this.showFollow.bind(this, "followers")}
                className="pointer"
              >
                <i className="fa fa-archive fa-fw w3-margin-right w3-text-theme" />{" "}
                Statuses{" "}
                <span className="w3-right ">
                  <strong>{data.statuses_count}</strong>
                </span>
              </p>
            </div>
            <div className="w3-container">
              <div className={!profile ? "w3-half" : ""}>
                {!this.state.isfollowed && (
                  <button
                    className="w3-button w3-block w3-theme w3-section"
                    title="Follow"
                    onClick={this.followUser}
                  >
                    <i className="fa fa-thumbs-up" /> Follow
                  </button>
                )}
                {this.state.isfollowed && (
                  <button
                    className="w3-button w3-block w3-theme w3-section"
                    title="Follow"
                    onClick={this.unfollowUser}
                  >
                    <i className="fa fa-thumbs-down" /> Unfollow
                  </button>
                )}
              </div>
              <div className="w3-half">
                <button
                  className="w3-button w3-block w3-theme-d2 w3-section"
                  title="Message"
                >
                  <i className="fa fa-comment" /> Message
                </button>
              </div>
              <div className={!profile ? "w3-half" : ""}>
                {!this.state.isBlocked && (
                    <button
                        className="w3-button w3-block w3-theme-d2 w3-section"
                        title="Block"
                        onClick={this.blockUser}
                    >
                      <i className="fa fa-lock" /> Block
                    </button>
                )}
                {this.state.isBlocked && (
                    <button
                        className="w3-button w3-block w3-theme w3-section"
                        title="UnBlock"
                        onClick={this.unBlockUser}
                    >
                      <i className="fa fa-unlock" /> UnBlock
                    </button>
                )}
              </div>
              <div className="w3-half">
                {!this.state.isMute && (
                    <button
                        className="w3-button w3-block w3-theme w3-section"
                        title="Mute"
                        onClick={this.muteUser}
                    >
                      <i className="fa fa-bell-slash" /> Mute
                    </button>
                )}
                {this.state.isMute && (
                    <button
                        className="w3-button w3-block w3-theme w3-section"
                        title="UnMuteUser"
                        onClick={this.unMuteUser}
                    >
                      <i className="fa fa-bell" /> UnMute
                    </button>
                )}
              </div>
            </div>
          </div>
          <br />
          {this.state.showFollowers && (
            <div>
              <div className="w3-card w3-round w3-white">
                <div className="w3-container">
                  <p>
                    <strong>Followers</strong>
                      <ul>
                        {dataToPopulateInFollowersList}
                      </ul>
                  </p>
                </div>
              </div>
              <br />
            </div>
          )}
          {this.state.showFollowings && (
            <div>
              <div className="w3-card w3-round w3-white">
                <div className="w3-container">
                  <p>
                    <strong>Following</strong>
                    {this.state.showFollowings && (
                      <ul>
                        {dataToPopulateInFollowingList}
                      </ul>
                    )}
                  </p>
                </div>
              </div>
              <br />
            </div>
          )}
          <div className="w3-card w3-round w3-white">
            <div className="w3-container">
              <p>
                <strong>Statistics</strong>
              </p>
              <p>
                <i className="fa fa-user fa-fw w3-margin-right w3-text-theme" />{" "}
                User ID <strong>{data.acct}</strong>
              </p>
              <p>
                <i className="fa fa-clock-o fa-fw w3-margin-right w3-text-theme" />{" "}
                Member since{" "}
                <strong>
                  <span>
                    {dayjs(data ? data.created_at : 0).format("DD MMM YYYY")}
                  </span>
                </strong>
              </p>
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
  user: state.user,
});

const mapActionsToProps = { uploadImage };

ProfileTile.propTypes = {
  // logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ProfileTile));