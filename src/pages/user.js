import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scream from '../components/scream/Scream';
import Grid from '@material-ui/core/Grid';
import ScreamSkeleton from '../util/ScreamSkeleton';
import PostStatus from '../components/scream/PostStatus';
import { connect } from 'react-redux';
import ProfileTile from '../components/layout/ProfileTile';
import axios from "axios";

class user extends Component {
  state = {
    profile: {},
    screamIdParam: null,
    profileName: '',
    isLoggedInUser: false
  };

  getUserProfileData = (id) => {
    axios
        .get(`https://pleroma.site/api/v1/accounts/${id}/statuses`, { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`} })
      .then((res) => {
        this.setState ({profile: res.data})
      })
      .catch(() => {
      });
  };
  componentDidMount() {
    this.state.profileName = this.props.match.params.handle;
    // const userId = this.props.match.params.handle;
    const screamId = this.props.match.params.screamId;

    if (screamId) this.setState({ screamIdParam: screamId });

    if (localStorage.getItem('userId') == this.props.profileId){
      this.setState ({isLoggedInUser: true})
    }

    //this.props.getUserData(handle, this.props.user);
    // const userId = localStorage.getItem('userId');
    this.getUserProfileData(screamId);

  }
  render() {
    const { posts, loading } = this.props.data;
    const { screamIdParam } = this.state;
    // const handle = localStorage.getItem('username');

    // this.state.profileName = posts.map((post) => post.account.display_name);

    const screamsMarkup = loading ? (
      <ScreamSkeleton />
    ) : posts === null ? (
      <p>No data from this user</p>
    ) : !screamIdParam ? (
        posts.map((post) =>
         <Scream key={post.id} scream={post} />)
    ) : (
        posts.map((post) => {
        if (post.screamId !== screamIdParam)
          return <Scream key={post.screamId} scream={post} />;
        else return <Scream key={post.screamId} scream={post} openDialog />;
      })
    );

    console.log('In User send posts object in profile tile to populate: ', this.state.profile)
    const createProfileTile = this.state.isLoggedInUser ? (
      <ProfileTile />
    ) : ( <ProfileTile profileId={this.state.screamIdParam} profile={this.state.profile}/> );

    return (
      <Grid container spacing={16}>
        <Grid item sm={12} xs={12}>
          <div className="w3-card w3-round w3-white">
            <div className="w3-container w3-padding">
              <PostStatus />
            </div>
          </div>
          <div className="w3-container w3-padding w3-card w3-white w3-round w3-margin-top w3-margin-bottom">
            <h5 className="w3-opacity">Personal Timeline of {this.state.profileName}</h5>
          </div>
          {screamsMarkup}
          <Grid item sm={12} xs={12}>
          {createProfileTile}
                  </Grid>
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  // getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data
});

export default connect(
  mapStateToProps,
  // { getUserData }
)(user);
