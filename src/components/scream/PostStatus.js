import React, { Component, Fragment } from 'react';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import InsertEmoticonOutlined from '@material-ui/icons/InsertEmoticonOutlined';
import { connect } from 'react-redux';
import { postStatus, clearErrors } from '../../redux/actions/dataActions';
import axios from 'axios';

const styles = (theme) => ({
  ...theme,
  submitButton: {
    position: 'relative',
    float: 'right',
    marginTop: 10
  },
  progressSpinner: {
    position: 'absolute'
  },
  closeButton: {
    position: 'absolute',
    left: '91%',
    top: '6%'
  }
});

class PostStatus extends Component {
  state = {
    open: false,
    status: '',
    file: null,
    media_ids: [],
    chosenEmoji: '',
    button: true,
    visibility: 'public',
    visibilityMessage: 'Public Post: This post will be visible to all.',
    openEmojiPicker: false,
    errors: {}
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ status: '', open: false, errors: {} });
    }
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };
  handleChange = async (event) => {
    if (event.target.name === 'file') {
      this.setState({
        file: event.target.files[0]
      })
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  upload = (event) => {
    this.state.file = event.target.files[0];
    this.uploadMedia(event.target.files[0]);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    var status = {
      status: this.state.status,
      emoji: this.state.chosenEmoji,
      media_ids: this.state.media_ids,
      visibility: this.state.visibility
    };
    this.props.postStatus(status);
    this.setState({
      status: '',
      media_ids: [],
      file: null,
      chosenEmoji: ''
    })
  };
  onEmojiClick = (event, emojiObject) => {
    this.setState({
      chosenEmoji: emojiObject.emoji,
      openEmojiPicker: false
    })
  };

  onDirectMessageClick = () => {
    this.setState({button:!this.state.button})
    if(this.state.visibility == 'public'){
      this.setState({visibility: 'direct'});
      this.setState({ visibilityMessage: 'Direct Message: This post will be visible to all the mentioned users.' });
    } else {
      this.setState({visibility: 'public'});
      this.setState({visibilityMessage: 'Public Post: This post will be visible to all.'});
    }
    this.render();
  };

  // Upload Media for post
  uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    await axios
        .post('https://pleroma.site/api/v1/media', formData,
            {
              headers: {
                "Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`,
                "Content-Type" : "multipart/form-data",
                "Accept" : "*/*",
                "accept-encoding" : "gzip, deflate, br"
              }
            })
        .then((res) => {
          this.state.media_ids.push(res.data.id);
        })
        .catch((err) => {
          console.log('Error while uploading media ', err);
        });
  };
  render() {
    const {
      classes,
      UI: { loading }
    } = this.props;
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit} className="post-status-form">
          <textarea
            name="status"
            placeholder="Remember to follow Fediverse's guidelines while posting"
            rows="2"
            className="form-control"
            value={this.state.status}
            onChange={this.handleChange}
          ></textarea>
          {
            this.state.chosenEmoji &&
            <ul className="emoji-list">
              <li>{this.state.chosenEmoji}</li>
            </ul>
          }
          <div className="emoji-picker">
            <button type="button" onClick={() => { this.setState({ openEmojiPicker: !this.state.openEmojiPicker }) }} className="w3-button w-right w3-theme-d2 ml-8">
              <InsertEmoticonOutlined className="w3-left" />
            </button>
            {this.state.openEmojiPicker && <Picker onEmojiClick={this.onEmojiClick} disableAutoFocus={true} skinTone={SKIN_TONE_MEDIUM_DARK} />}
          </div>
          <span className="word-counter">{1000 - this.state.status.length}</span>
          {this.state.file && <p>{this.state.file.name}</p>}
          <button type="submit" className="w3-button w3-theme mr-5"><i className="fa fa-pencil" />
            {loading && (
              <CircularProgress
                color="secondary"
                size={30}
                className={classes.progressSpinner}
              />
            )} Submit</button>
          <button type="button" className="w3-button w-right file-button w3-theme-d1">
            <i className="fa fa-paperclip" />
            <input type="file" name="file" onChange={this.upload} className="file-input" />
          </button>
          <button type="button" className={this.state.button ? "w3-button w-right ml-5 w3-theme-d2": "w3-button w-right ml-5 w3-theme"}
            title={this.state.visibilityMessage}
            onClick={this.onDirectMessageClick}>
            <i className="fa fa-comment" />
          </button>
        </form>
      </Fragment>
    );
  }
}

PostStatus.propTypes = {
  postStatus: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { postStatus, clearErrors }
)(withStyles(styles)(PostStatus));
