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
    // we need this for media handling. test when Pleroma S3 is working
    //await this.uploadMedia(event.target.files);
    if (event.target.name === 'file') {
      this.setState({
        file: event.target.files[0]
      })
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.postStatus({ status: this.state.status, emoji: this.state.chosenEmoji, media_ids: this.state.media_ids });
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

  // Upload Media for post
  uploadMedia = async (file) => {
    await axios
        .post('https://pleroma.site/api/v1/media', file, { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`} })
        .then((res) => {
          this.state.media_ids.push(res.id);
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
          <button type="button" className="w3-button w-right file-button w3-theme-d2">
            <i className="fa fa-paperclip" />
            <input type="file" name="file" onChange={this.handleChange} className="file-input" />
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
