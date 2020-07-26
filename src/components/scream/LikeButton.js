import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import NewButtonRed from '../../util/NewButtonRed';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// REdux
import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../../redux/actions/dataActions';

export class LikeButton extends Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.screamId
      )
    )
      return true;
    else return false;
  };
  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <NewButtonRed tip="Like">
          <FavoriteIcon color="inherit" className="pull-left" />
          <span className="ml-5">{this.props.likeCount}</span>
        </NewButtonRed>
      </Link>
    ) : this.likedScream() ? (
      <NewButtonRed tip="Undo like" color="bray" onClick={this.unlikeScream}>
        <FavoriteIcon color="inherit" className="pull-left" />
        <span className="ml-5">{this.props.likeCount}</span>
      </NewButtonRed>
    ) : (
      <NewButtonRed tip="Like" onClick={this.likeScream}>
        <FavoriteIcon color="inherit" className="pull-left" />
        <span className="ml-5">{this.props.likeCount}</span>
      </NewButtonRed>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  likeScream,
  unlikeScream
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(LikeButton);
