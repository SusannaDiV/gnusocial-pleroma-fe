import React, { Component } from "react";
import PropTypes from "prop-types";
import Scream from "../components/scream/Scream";
import ScreamSkeleton from "../util/ScreamSkeleton";
import PostStatus from "../components/scream/PostStatus";
import { connect } from "react-redux";
import { getPublicPosts } from "../redux/actions/dataActions";
import ProfileTile from "../components/layout/ProfileTile";
import Profile from "../components/profile/Profile";


class publicHome extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getPublicPosts();
    // this.getUserProfile(localStorage.getItem("userId"));
  }

  loadHome = async () => {
    await this.props.getPublicPosts();
    this.render();
  };

  render() {
    console.log("Public component being rendered", this.props.data);
    const { posts, loading } = this.props.data;
    const isLoggedIn = localStorage.getItem("tokenStr") != null;
    const profId = localStorage.getItem("userId");

    let showProfile = '';
    isLoggedIn ? 
     showProfile = ( <ProfileTile isLoggedIn={true} profileId={profId} /> ) : showProfile = ( <Profile isLoggedIn={false} /> )
    let recentPostsMarkup = !loading ? (
      posts?.map((post) =>
        post.reblogged && post.reblog != null ? (
          <Scream
            key={post.reblog.id}
            userNameRepeated={post.account.display_name}
            onUserAction={() => this.loadHome()}
            scream={post.reblog}
          />
        ) : (
          <Scream
            key={post.id}
            onUserAction={() => this.loadHome()}
            scream={post}
          />
        )
      )
    ) : (
      <ScreamSkeleton />
    );
    return (
      <div className="container">
        <div className="w3-row">
          <div className="w3-col m8">
            {isLoggedIn ? (
              <div className="w3-card w3-round w3-white">
                <div className="w3-container w3-padding-24">
                  <PostStatus />
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div className="w3-container w3-padding w3-card w3-white w3-round w3-margin-top w3-margin-bottom">
              <h5 className="w3-opacity">
                Public Timeline
              </h5>
            </div>
            {recentPostsMarkup}
          </div>
          <div style={{ paddingLeft: "20px" }} className="w3-col m4">
             {showProfile}
          </div>
        </div>
      </div>
    );
  }
}

publicHome.propTypes = {
    getPublicPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user,
});

export default connect(mapStateToProps, { getPublicPosts })(publicHome);
