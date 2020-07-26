import React, { Component, Fragment } from 'react';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
// MUI Stuff

import CircularProgress from '@material-ui/core/CircularProgress';

import InsertEmoticonOutlined from '@material-ui/icons/InsertEmoticonOutlined';
// Redux stuff
import { connect } from 'react-redux';
import { postStatus, clearErrors } from '../../redux/actions/dataActions';

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

const customNames = {
  foods: 'food and drink',
  nature: 'outdoors',
  objects: 'stuff'
};

class PostStatus extends Component {
  state = {
    open: false,
    body: '',
    file: null,
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
      this.setState({ body: '', open: false, errors: {} });
    }
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };
  handleChange = (event) => {
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
    this.props.postStatus({ body: this.state.body, emoji: this.state.chosenEmoji });
    this.setState({
      body: '',
      file: null,
      chosenEmoji: ''
    })
  };
  onEmojiClick = (event, emojiObject) => {
    this.setState({
      chosenEmoji: emojiObject.emoji,
      openEmojiPicker: false
    })
  }
  render() {
    const {
      classes,
      UI: { loading }
    } = this.props;
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit} className="post-status-form">
          <textarea
            name="body"
            placeholder="Remember to follow Fediverse's guidelines while posting"
            rows="2"
            className="form-control"
            value={this.state.body}
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
          
          <span className="word-counter">{1000 - this.state.body.length}</span>
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
