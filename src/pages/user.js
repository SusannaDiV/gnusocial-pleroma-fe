import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Scream from '../components/scream/Scream';
import Grid from '@material-ui/core/Grid';

import ScreamSkeleton from '../util/ScreamSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';
import PostStatus from '../components/scream/PostStatus';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';
import ProfileTile from '../components/layout/ProfileTile';

class user extends Component {
  state = {
    profile: null,
    screamIdParam: null
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    const screamId = this.props.match.params.screamId;

    if (screamId) this.setState({ screamIdParam: screamId });

    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { screams, loading } = this.props.data;
    const { screamIdParam } = this.state;

    const screamsMarkup = loading ? (
      <ScreamSkeleton />
    ) : screams === null ? (
      <p>No screams from this user</p>
    ) : !screamIdParam ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
            screams.map((scream) => {
              if (scream.screamId !== screamIdParam)
                return <Scream key={scream.screamId} scream={scream} />;
              else return <Scream key={scream.screamId} scream={scream} openDialog />;
            })
          );

    return (
      <Grid container spacing={16}>
        <Grid item sm={12} xs={12}>
          <div className="w3-card w3-round w3-white">
            <div className="w3-container w3-padding">
              <PostStatus />
            </div>
          </div>
          <div className="w3-container w3-padding w3-card w3-white w3-round w3-margin-top w3-margin-bottom">
            <h5 className="w3-opacity">Public Timeline</h5>
          </div>
          {screamsMarkup}
        </Grid>
        {/* <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <ProfileTile profile={this.state.profile} />
          )}
        </Grid> */}
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getUserData }
)(user);
