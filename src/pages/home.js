import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Scream from '../components/scream/Scream';
import ProfileTile from '../components/layout/ProfileTile';
import ScreamSkeleton from '../util/ScreamSkeleton';
import PostStatus from '../components/scream/PostStatus';

import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';

class home extends Component {
  componentDidMount() {
    this.props.getScreams();
  }
  render() {
    const { screams, loading } = this.props.data;

    // const dummyScreams = [
    //   {
    //     body: 'body',
    //     createdAt: new Date(),
    //     userImage: 'fdasdf',
    //     userHandle: 'sadfas',
    //     screamId: 1,
    //     likeCount: 3,
    //     commentCount: 2,
    //   }
    // ]



    let recentScreamsMarkup = !loading ? (
      screams?.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
        <ScreamSkeleton />
      );
    return (
      <div>
        <div className="w3-card w3-round w3-white">
          <div className="w3-container w3-padding-24">
            <PostStatus />
          </div>
        </div>
        <div className="w3-container w3-padding w3-card w3-white w3-round w3-margin-top w3-margin-bottom">
          <h5 className="w3-opacity">Personal Timeline of {this.props.user && this.props.user.credentials.handle}</h5>
        </div>
        {recentScreamsMarkup}
      </div>
    );
  }
}

home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user
});

export default connect(
  mapStateToProps,
  { getScreams }
)(home);
