import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import NewButtonGold from '../../util/NewButtonGold'
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';
// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
import InsertLink from '@material-ui/icons/InsertLink';
// Redux
import { connect } from 'react-redux';

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class Scream extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} />
      ) : null;
    return (
      <div className="scream-item w3-container w3-card w3-white w3-round">
        <img src={userImage} alt="Profile image" className="w3-left w3-margin-right" />
        <span className="w3-right w3-opacity">{dayjs(createdAt).fromNow()}</span>
        <h5 className="w3-opacity"><Link to={`/users/${userHandle}`}><strong>{userHandle}</strong></Link></h5>
        {deleteButton}
        <hr className="w3-clear" />
        <p variant="body1 mb-30">{body}</p>
        
        <LikeButton screamId={screamId} />
        <NewButtonGold tip="comments">
          <ChatIcon color="white" className="w3-left" />
          <span className="ml-5">{commentCount} comments</span>
        </NewButtonGold>
        <div className="w3-right">
        <ScreamDialog
          screamId={screamId}
          userHandle={userHandle}
          openDialog={this.props.openDialog}
        />
        <NewButtonGold tip="From Web">
          <InsertLink className="w3-left" />
        </NewButtonGold>
        </div>
      </div>
      // <Card className={classes.card}>
      //   <CardMedia
      //     image={userImage}
      //     title="Profile image"
      //     className={classes.image}
      //   />
      //   <CardContent className={classes.content}>
      //     <Typography
      //       variant="h5"
      //       component={Link}
      //       to={`/users/${userHandle}`}
      //       color="primary"
      //     >
      //       {userHandle}
      //     </Typography>
      //     {deleteButton}
      //     <Typography variant="body2" color="textSecondary">
      //       {dayjs(createdAt).fromNow()}
      //     </Typography>
      //     <Typography variant="body1">{body}</Typography>
      //     <LikeButton screamId={screamId} />
      //     {/* <span>{likeCount} Likes</span> */}
      //     <NewButtonGold tip="comments">
      //       <ChatIcon color="white" className="w3-left" />
      //       <span>{commentCount} comments</span>
      //     </NewButtonGold>
      //     <div className="scream-button-right">
      //       <ScreamDialog
      //         screamId={screamId}
      //         userHandle={userHandle}
      //         openDialog={this.props.openDialog}
      //       />
      //       <NewButtonGold tip="From Web">
      //         <InsertLink className="w3-left" />
      //       </NewButtonGold>
      //     </div>

      //   </CardContent>
      // </Card>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
