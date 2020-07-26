import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Scream from '../components/scream/Scream';
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
          <h5 className="w3-opacity">{this.props.user.authenticated ? 'Personal TImeline ' + this.props.user.credentials.handle : 'Public Timeline'}</h5>
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
