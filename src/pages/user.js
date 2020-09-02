import React, { Component } from "react";
import PropTypes from "prop-types";
import Scream from "../components/scream/Scream";
import ScreamSkeleton from "../util/ScreamSkeleton";
import PostStatus from "../components/scream/PostStatus";
import { connect } from "react-redux";
import ProfileTile from "../components/layout/ProfileTile";
import { getUserData } from "../redux/actions/dataActions";
import { Redirect } from "react-router-dom";

class user extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      screamIdParam: null,
      profileName: "",
      isLoggedInUser: false,
      redirect: null
    };
  }
  componentDidMount() {
    this.setState({ profileName: this.props.match.params.handle });
    const screamId = this.props.match.params.screamId;

    if (screamId) this.setState({ screamIdParam: screamId });

    if (localStorage.getItem("userId") === screamId) {
      this.setState({ isLoggedInUser: true });
    }

    this.props.getUserData(screamId);
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.screamId !== prevProps.match.params.screamId) {
      this.setState({ profileName: this.props.match.params.handle });
      const screamId = this.props.match.params.screamId;

      if (screamId) this.setState({ screamIdParam: screamId });

      if (localStorage.getItem("userId") === screamId) {
        this.setState ({isLoggedInUser: true});
      }else{
        this.setState ({isLoggedInUser: false})
      }
      this.props.getUserData(screamId);
    }
  }
  render() {
    const { posts, loading } = this.props.data;
    const { screamIdParam } = this.state;
    const profId = this.props.match.params.screamId;
    const name = this.props.match.params.handle;
    const isLoggedIn = this.state.isLoggedInUser;
    let createProfileTile = '';

    if (posts == null) {
      return <Redirect to={`/users/${name}/scream/${profId}`} />;
    }

     createProfileTile = isLoggedIn ? (
      <ProfileTile isLoggedIn={true} profileId={profId} />
    ) : (
      <ProfileTile isLoggedIn={false} profileId={profId} />
    );

    const screamsMarkup = loading ? (
      <ScreamSkeleton />
    ) : posts === null ? (
      <p>No data from this user</p>
    ) : !screamIdParam ? (
      posts.map((post) => <Scream key={post.id} scream={post} />)
    ) : (
      posts.map((post) => {
        if (post.screamId !== screamIdParam)
          return <Scream key={post.screamId} scream={post} />;
        else return <Scream key={post.screamId} scream={post} openDialog />;
      })
    );

    return (
      <div className="container">
        <div className="w3-row">
          <div className="w3-col m8">
            {isLoggedIn ? (
              <div>
                <div className="w3-card w3-round w3-white">
                  <div className="w3-container w3-padding">
                    <PostStatus />
                  </div>
                </div>
                <div className="w3-container w3-padding w3-card w3-white w3-round w3-margin-top w3-margin-bottom">
                  <h5 className="w3-opacity">
                    Personal Timeline of {this.state.profileName}
                  </h5>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            {screamsMarkup}
          </div>
          <div style={{ paddingLeft: "20px" }} className="w3-col m4">
            {createProfileTile}
          </div>
        </div>
      </div>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(user);
