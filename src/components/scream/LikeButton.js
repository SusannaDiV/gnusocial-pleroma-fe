import React, { Component } from 'react';
import NewButtonRed from '../../util/NewButtonRed';
import PropTypes from 'prop-types';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { likeScream, unlikeScream } from '../../redux/actions/dataActions';

export class LikeButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLikeButton: true,
    }
  }

  componentDidMount(){
    console.log('data fetching | like count: ', this.props.likeCount)
    console.log('data fetching | isLiked: ', this.props.favourited)
    console.log('data fetching | screamId: ', this.props.screamId)
    if(this.props.favourited){
      this.setState({ showLikeButton: false })
    } else{
      this.setState({ showLikeButton: true })
    }
  }

  // likedScream = () => {
  //   if (
  //     this.props.user.likes &&
  //     this.props.user.likes.find(
  //       (like) => like.screamId === this.props.screamId
  //     )
  //   )
  //     return true;
  //   else return false;
  // };
  likeScream = () => {
    console.log('Inside like scream | screamId: ', this.props.screamId)
    this.props.likeScream(this.props.screamId);
    // console.log('Returned data: ', this.likedData.favourites_count)
    this.setState({ showLikeButton: false })
      // this.state.showUnlikeButton = true;
  };
  unlikeScream = () => {
    console.log('Inside unlike | screamId: ', this.props.screamId)
    this.props.unlikeScream(this.props.screamId)
    this.setState({ showLikeButton: true })
      // this.state.showUnlikeButton = true;
  };
  render() {
    const { authenticated } = this.props.user;
    // const likeButton = !authenticated ? (
    //   <Link>
    //     <NewButtonRed onClick={this.likeScream} tip="Like">
    //       <FavoriteIcon color="inherit" className="pull-left" />
    //       <span className="ml-5"></span>
    //     </NewButtonRed>
    //   </Link>
    // ) : this.likeScream() ? (
    //   <NewButtonRed tip="Undo like" color="bray" onClick={this.unlikeScream}>
    //     <FavoriteIcon color="inherit" className="pull-left" />
    //     <span className="ml-5">{this.props.likeCount}</span>
    //   </NewButtonRed>
    // ) : (
    //   <NewButtonRed tip="Like" onClick={this.likeScream}>
    //     <FavoriteIcon color="inherit" className="pull-left" />
    //     <span className="ml-5">{this.props.likeCount}</span>
    //   </NewButtonRed>
    // );
    return (
      <React.Fragment>
      {!this.state.showLikeButton &&  (
      <NewButtonRed tip="Undo like" color="bray" onClick={this.unlikeScream}>
        <FavoriteIcon color="inherit" className="pull-left" />
        <span className="ml-5">{this.props.likeCount}</span>
      </NewButtonRed>
    )} 
    {this.state.showLikeButton && (
      <NewButtonRed tip="Like" onClick={this.likeScream}>
        <FavoriteIcon color="inherit" className="pull-left" />
        <span className="ml-5">{this.props.likeCount}</span>
      </NewButtonRed>
    )}
    </React.Fragment>
    )
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  // likedData: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  // likedData: state.data
});

const mapActionsToProps = {
  likeScream,
  unlikeScream
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(LikeButton);
