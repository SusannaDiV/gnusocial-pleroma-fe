import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import NewButtonGold from "../../util/NewButtonGold";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";
// Icons
import ChatIcon from "@material-ui/icons/Chat";
import InsertLink from "@material-ui/icons/InsertLink";
import InsertEmoticonOutlined from "@material-ui/icons/InsertEmoticonOutlined";
// Redux
import { connect } from "react-redux";
import axios from "axios";
import NewButtonRed from "../../util/NewButtonRed";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class Scream extends Component {
  state = {
    chosenEmoji: [],
    openEmojiPicker: false,
    showRetweetButton: true,
    retweetCounts: 0,
    userRepeatedTweet: "",
    isStatusRepeated: false,
    isStatusReplied: false,
    inReplyToUserName: "",
  };

  componentDidMount() {
    this.setRetweetButtonState(this.props.scream.reblogged);
    this.setRetweetCountsState(this.props.scream.reblogs_count);
    if (this.props.userNameRepeated != null) {
      this.setState({ userRepeatedTweet: this.props.userNameRepeated });
      this.setState({ isStatusRepeated: true });
    }
    if (this.props.scream.in_reply_to_id != null) {
      this.setState({ isStatusReplied: true });
      if (
        this.props.scream.in_reply_to_id !== this.props.scream.mentions[0].id
      ) {
        this.setState({ inReplyToUserName: this.props.scream.mentions[0].acct });
      }
    }
  }

    setContentImage = (content) => {
    if(content.includes('/media/')) {
      return content.match(/href="([^?]*)/)[1];
    }
    return null;
    };

  onEmojiClick = (event, emojiObject) => {
    emojiObject.count = 1;
    this.reactWithEmoji(emojiObject);
    var found = false;
    const newEmoji = this.state.chosenEmoji.map((emoji) => {
      if (emoji.unified === emojiObject.unified) {
        found = true;
        emoji.count += 1;
      }
      return emoji;
    });

    if (!found) {
      this.setState({
        chosenEmoji: [...this.state.chosenEmoji, emojiObject],
        openEmojiPicker: false,
      });
    } else {
      this.setState({
        chosenEmoji: newEmoji,
        openEmojiPicker: false,
      });
    }
  };

  reactWithEmoji = (emojiObject) => {
    axios
      .put(
        `https://pleroma.site/api/v1/pleroma/statuses/${this.props.scream.id}/reactions/${emojiObject.unified}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
          },
        }
      )
      .then((res) => {
        console.log("Response", res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  retweet = async (id) => {
    await axios
      .post(`https://pleroma.site/api/v1/statuses/${id}/reblog`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        console.log("Response from retweet: ", res.data);
        // this.props.scream.reblogged = res.data.reblogged;
        // this.props.scream.reblogs_count = res.data.reblogs_count;
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  undoRetweet = async (id) => {
    await axios
      .post(`https://pleroma.site/api/v1/statuses/${id}/unreblog`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  setRetweetButtonState = (retweeted) => {
    if (retweeted) {
      this.setState({ showRetweetButton: false });
    } else {
      this.setState({ showRetweetButton: true });
    }
  };

  setRetweetCountsState = (retweetedCountsTotal) => {
    this.setState({ retweetCounts: retweetedCountsTotal });
  };

  onRetweet = async () => {
    await this.retweet(this.props.scream.id);
    await this.props.onUserAction();
    this.setRetweetButtonState(this.props.scream.reblogged);
    this.setRetweetCountsState(this.props.scream.reblogs_count);
  };
  onUndoRetweet = async () => {
    await this.undoRetweet(this.props.scream.id);
    await this.props.onUserAction();
    this.setRetweetButtonState(this.props.scream.reblogged);
    this.setRetweetCountsState(this.props.scream.reblogs_count);
  };

  render() {
    const isLoggedIn = localStorage.getItem("tokenStr") != null;
    const loggedUserName = localStorage.getItem("username");

    dayjs.extend(relativeTime);
    const {
      scream: {
        spoiler_text,
        content,
        created_at,
        userImage,
        account,
        id,
        favourites_count,
        favourited,
        pleroma,
        visibility,
        // emoji
      },
    } = this.props;

    const deleteButton =
      isLoggedIn && account.username === loggedUserName ? (
        <DeleteScream screamId={id} />
      ) : null;

    const contentImage =  this.setContentImage(content);

    return (
      <div className="scream-item w3-container w3-card w3-white w3-round">
        <img src={account ? account.avatar : userImage} className="w3-circle w3-left w3-margin-right" alt="Avatar" />
        <span className="w3-right w3-opacity">
          {dayjs(created_at).fromNow()}
        </span>
        <h5 className="w3-opacity">
          <Link to={`/users/${account.username}/scream/${account.id}`}>
            <strong>{account.username}</strong>
          </Link>
        </h5>
        {this.state.isStatusRepeated && (
          <div className="w3-left w3-margin-right">
            <span className="w3-right w3-opacity w3-theme-d2">
              {this.state.userRepeatedTweet} Repeated
            </span>
          </div>
        )}
        {this.state.isStatusReplied && (
          <div className="w3-left w3-margin-right">
            <span className="w3-right w3-opacity w3-theme-d2">
              Reply to {this.state.inReplyToUserName}
            </span>
          </div>
        )}
        {deleteButton}
        <hr className="w3-clear" />
        <p variant="body1 mb-30">{spoiler_text}</p>
        <p variant="body1 mb-30">{ReactHtmlParser(content)}</p>
          <a href={contentImage}><img src={contentImage} alt=''/></a>
        <ul className="emoji-list">
          {this.state.chosenEmoji.length > 0 &&
            this.state.chosenEmoji.map((emoji) => (
              <li key={emoji.unified}>
                {emoji.emoji} {emoji.count}
              </li>
            ))}
        </ul>
        <LikeButton
          screamId={id}
          inConversation={false}
          likeCount={favourites_count}
          onAction={() => this.props.onUserAction()}
          favourited={favourited}
        />
        <NewButtonGold tip="Replies">
          <ChatIcon color="inherit" className="w3-left" />
          <span className="ml-5">{pleroma.favourites_count}</span>
        </NewButtonGold>
        <span className="mr-8" />
        {visibility === 'direct' && (
            <NewButtonRed
                tip="Post marked as Direct can not be ReBlogged or shared."
                className="w3-button w-right file-button w3-theme-d2 copy-button"
                color="bray">
              <i className="fa fa-recycle" />
            </NewButtonRed>
        )}
        {!this.state.showRetweetButton && visibility === 'public' && (
          <NewButtonRed
            tip="Undo Retweet"
            className="w3-button w-right file-button w3-theme-d2 copy-button"
            color="bray"
            onClick={this.onUndoRetweet}
          >
            <i className="fa fa-recycle" />
            <span className="ml-5">{this.state.retweetCounts}</span>
          </NewButtonRed>
        )}
        {this.state.showRetweetButton && visibility === 'public' && (
          // <Link to="/">
          <NewButtonRed
            tip="Retweet"
            className="w3-button w-right file-button w3-theme-d2 copy-button"
            onClick={this.onRetweet}
          >
            <i className="fa fa-recycle" />
            <span className="ml-5">{this.state.retweetCounts}</span>
          </NewButtonRed>
          // </Link>
        )}
        <div className="w3-right">
          <ScreamDialog
            screamId={id}
            userHandle={account}
            likeCount={favourites_count}
            favourited={favourited}
            openDialog={this.props.openDialog}
            onDialogueAction={() => this.props.onUserAction()}
          />
          <NewButtonGold tip="From Web">
            <InsertLink className="w3-left" />
          </NewButtonGold>
          <div className="emoji-picker">
            <button
              onClick={() => {
                this.setState({ openEmojiPicker: !this.state.openEmojiPicker });
              }}
              className="w3-button w-right w3-theme-d2 ml-8"
            >
              <InsertEmoticonOutlined className="w3-left" />
            </button>
            {this.state.openEmojiPicker && (
              <Picker
                onEmojiClick={this.onEmojiClick}
                disableAutoFocus={true}
                skinTone={SKIN_TONE_MEDIUM_DARK}
              />
            )}
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
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
