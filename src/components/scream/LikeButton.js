import React, { Component } from 'react';
import NewButtonRed from '../../util/NewButtonRed';
import PropTypes from 'prop-types';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';


export class LikeButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLikeButton: true,
      likeCounts: 0,
    }
  }

  componentDidMount(){
    this.setLikeButtonState(this.props.favourited)
    this.setLikesCountState(this.props.likeCount)
  }


  setLikeButtonState = (favourited) => {
    if(favourited){
      this.setState({ showLikeButton: false })
    } else{
      this.setState({ showLikeButton: true })
    }
  }

  setLikesCountState = (likeCountTotal) => {
    this.setState({ likeCounts: likeCountTotal })
  }

  likeScreamCall = async (screamId) => {
    await axios
     .post(`https://pleroma.site/api/v1/statuses/${screamId}/favourite`, null, { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`}})
     .then((res) => {
       return res.status == 200
     })
     .catch((err) => console.log(err));
 };
 unlikeScreamCall = async (screamId) => {
  await axios
   .post(`https://pleroma.site/api/v1/statuses/${screamId}/unfavourite`, null, { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`}})
   .then((res) => {
     return res.status == 200
   })
   .catch((err) => console.log(err));
};
  likeScream = async () => {
    await this.likeScreamCall(this.props.screamId);
    this.props.onAction();
    this.setLikeButtonState(this.props.favourited);
    this.setLikesCountState(this.props.likeCount)
  };
  unlikeScream = async () => {
    await this.unlikeScreamCall(this.props.screamId)
    this.props.onAction();
    this.setLikeButtonState(this.props.favourited);
    this.setLikesCountState(this.props.likeCount)
  };
  render() {
    return (
      <React.Fragment>
      {!this.state.showLikeButton &&  (
      <NewButtonRed tip="Undo like" color="bray" onClick={this.unlikeScream}>
        <FavoriteIcon color="inherit" className="pull-left" />
        <span className="ml-5">{this.state.likeCounts}</span>
      </NewButtonRed>
    )} 
    {this.state.showLikeButton && (
       <Link to="/">
      <NewButtonRed tip="Like" onClick={this.likeScream}>
        <FavoriteIcon color="inherit" className="pull-left" />
        <span className="ml-5">{this.state.likeCounts}</span>
      </NewButtonRed>
      </Link>
    )}
    </React.Fragment>
    )
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});


export default connect(
  mapStateToProps,
)(LikeButton);
