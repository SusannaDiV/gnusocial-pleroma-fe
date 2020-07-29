import React, { Component } from 'react';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import NewButtonGold from '../../util/NewButtonGold'
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
import InsertLink from '@material-ui/icons/InsertLink';
import InsertEmoticonOutlined from '@material-ui/icons/InsertEmoticonOutlined';
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
  state = {
    chosenEmoji: [],
    openEmojiPicker: false,
  }
  onEmojiClick = (event, emojiObject) => {
    emojiObject.count = 1;
    var found = false;
    const newEmoji = this.state.chosenEmoji.map(emoji => {
      if (emoji.unified === emojiObject.unified) {
        found = true;
        emoji.count += 1;
      }
      return emoji;
    })

    if (!found) {
      this.setState({
        chosenEmoji: [...this.state.chosenEmoji, emojiObject],
        openEmojiPicker: false
      })
    } else {
      this.setState({
        chosenEmoji: newEmoji,
        openEmojiPicker: false
      })
    }

  }

  render() {
    dayjs.extend(relativeTime);
    const {
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount,
        // emoji
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
        <div src={userImage} alt="Profile image" className="w3-left w3-margin-right" />
        <span className="w3-right w3-opacity">{dayjs(createdAt).fromNow()}</span>
        <h5 className="w3-opacity"><Link to={`/users/${userHandle}`}><strong>{userHandle}</strong></Link></h5>
        {deleteButton}
        <hr className="w3-clear" />
        <p variant="body1 mb-30">{body}</p>

        <ul className="emoji-list">
          {
            this.state.chosenEmoji.length > 0 && this.state.chosenEmoji.map(emoji =>
              <li key={emoji.unified}>{emoji.emoji} {emoji.count}</li>
            )
          }
        </ul>
        <LikeButton screamId={screamId} likeCount={likeCount} />
        <NewButtonGold tip="Replies">
          <ChatIcon color="inherit" className="w3-left" />
          <span className="ml-5">{commentCount}</span>
        </NewButtonGold>
        <button className="w3-button w-right file-button w3-theme-d2 copy-button">
          <i className="fa fa-recycle" />
        </button>
        <div className="w3-right">
          <ScreamDialog
            screamId={screamId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
          <NewButtonGold tip="From Web">
            <InsertLink className="w3-left" />
          </NewButtonGold>
          <div className="emoji-picker">
            <button onClick={() => { this.setState({ openEmojiPicker: !this.state.openEmojiPicker }) }} className="w3-button w-right w3-theme-d2 ml-8">
              <InsertEmoticonOutlined className="w3-left" />
            </button>
            {this.state.openEmojiPicker && <Picker onEmojiClick={this.onEmojiClick} disableAutoFocus={true} skinTone={SKIN_TONE_MEDIUM_DARK} />}
          </div>
        </div>
      </div>
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
