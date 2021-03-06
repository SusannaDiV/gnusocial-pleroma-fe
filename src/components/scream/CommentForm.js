import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = (theme) => ({
  ...theme
});

class CommentForm extends Component {
  state = {
    body: '',
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '' });
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    const commentData = {
      status: this.state.body,
      source: 'Pleroma FE',
      visibility: 'public',
      content_type: 'text/plain',
      in_reply_to_id: this.props.screamId
    };
    event.preventDefault();
    this.props.submitComment(commentData);
    this.props.onSubmitAction();
  };

  render() {
    const { classes } = this.props;
    const commentFormMarkup =  (
      <Grid item sm={12} style={{ textAlign: 'center' }}>
        <form onSubmit={this.handleSubmit} className="overflow-hidden">
          <textarea
            name="body"
            placeholder="Comment on scream"
            rows="2"
            className="form-control"
            onChange={this.handleChange}
          ></textarea>
          <button type="submit" className="w3-button w3-theme w3-right">Submit</button>
        </form>
        <hr className={classes.visibleSeparator} />
      </Grid>
    );
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});

export default connect(
  mapStateToProps,
  { submitComment }
)(withStyles(styles)(CommentForm));
