import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scream from '../components/scream/Scream';
import ScreamSkeleton from '../util/ScreamSkeleton';
import PostStatus from '../components/scream/PostStatus';
import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';
import axios from 'axios';

class home extends Component {
  componentDidMount() {
      // if logged in call this
      this.getHomeTimelineData();
      // else call this
      this.getPublicTimelineData();
  }

    getHomeTimelineData = () => {
        axios
            .get('https://pleroma.site/api/v1/timelines/home?count=20&with_muted=true', { headers: {"Authorization" : `Bearer ${localStorage.getItem('login_token')}`} })
            .then((res) => {
                console.log('Timeline data: ', res)
            })
            .catch((err) => {
                console.log('Timeline data: ', err);
            });
    };

    getPublicTimelineData = () => {
        axios
            .get('https://pleroma.site/api/v1/timelines/home?only_media=false&count=20&with_muted=true', { headers: {"Authorization" : `Bearer ${localStorage.getItem('login_token')}`} })
            .then((res) => {
                console.log('Public Timeline data: ', res)
            })
            .catch((err) => {
                console.log('Public Timeline data: ', err);
            });
    };

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
          <h5 className="w3-opacity">{this.props.user.authenticated ? 'Personal Timeline of ' + this.props.user.credentials.handle : 'Public Timeline'}</h5>
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
