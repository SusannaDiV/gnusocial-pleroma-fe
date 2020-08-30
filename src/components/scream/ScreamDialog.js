import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Code from "@material-ui/icons/Code";
import { connect } from "react-redux";
import NewButtonRed from "../../util/NewButtonRed";
import Scream from "./Scream";
import ScreamSkeleton from "../../util/ScreamSkeleton";
import axios from "axios";

const styles = (theme) => ({
  ...theme,
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    left: "90%",
  },
  expandButton: {
    position: "absolute",
    left: "90%",
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50,
  },
});

class ScreamDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
    ancestors: {},
    inConversation: false,
    updateFavCounts: "",
    favourited: false
  };
  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }
  getScream = async (userId) => {
    // dispatch({ type: LOADING_UI });
    await axios
      .get(`https://pleroma.site/api/v1/statuses/${userId}/context`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        // const obj = {'item':newItemInput, 'columnType':newRadioValue};
        // res.data.ancestors.push
        this.state.ancestors = res.data.ancestors;
      })
      .catch((err) => console.log(err));
  };
  handleOpen = async () => {
    let oldPath = window.location.pathname;

    const { userHandle, screamId } = this.props;
    const newPath = `/users/${userHandle.username}/scream/${screamId}`;

    if (oldPath === newPath) oldPath = `/users/${userHandle.username}`;

    window.history.pushState(null, null, newPath);

    this.setState({ open: true, oldPath, newPath });
    await this.getScream(this.props.screamId);
    this.setState({ inConversation: true });
    // this.state.updateFavCounts= this.props.likeCount;
    // this.state.favourited= this.props.favourited;
    this.render();
  };
  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false });
    this.props.onDialogueAction();
    // this.props.clearErrors();
  };

  inConversationAction = async () => {
    await axios
      .get(
        "https://pleroma.site/api/v1/timelines/home?count=20&with_muted=true",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
          },
        }
      )
      .then((res) => {
        res.data.map((scream) => {
          if (scream.id == this.props.screamId) {
            this.props.likeCount = scream.favourites_count;
            this.props.favourited = scream.favourited;
            console.log("Updated fav counts: ", this.props.likeCount);
            this.render();
          }
        });
      })
      .catch((err) => {});
  };

  render() {
    const {
      classes,
      screamId,
      scream: {
        id,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments,
      },
      UI: { loading },
    } = this.props;

    let postsComments = this.state.inConversation ? (
      this.state.ancestors.map((commentsPost) =>
        commentsPost.reblogged && commentsPost.reblog != null ? (
          <Scream
            key={commentsPost.reblog.id}
            userNameRepeated={commentsPost.account.display_name}
            // onUserAction={() => this.loadHome()}
            scream={commentsPost.reblog}
          />
        ) : (
          <Scream
            key={commentsPost.id}
            // onUserAction={() => this.loadHome()}
            scream={commentsPost}
          />
        )
      )
    ) : (
      <ScreamSkeleton />
    );

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress color="secondary" size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img
            src={this.props.userHandle.avatar}
            alt="Profile"
            className={classes.profileImage}
          />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="textSecondary"
            variant="h5"
            to={`/users/${this.props.userHandle.username}`}
          >
            @{this.props.userHandle.username}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1" className="mb-30">
            {body}
          </Typography>
        </Grid>
        <hr className={classes.visibleSeparator} />
        <CommentForm
          screamId={screamId}
          onSubmitAction={() => this.handleClose()}
        />
        <Comments comments={comments} />
      </Grid>
    );
    return (
      <Fragment>
        <NewButtonRed onClick={this.handleOpen} tip="Expand scream">
          <Code color="inherit" className="w3-left" />
          <span className="ml-5">In conversation</span>
        </NewButtonRed>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {postsComments}
          </DialogContent>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI,
});

// const mapActionsToProps = {
//   getScream,
//   clearErrors,
// };

export default connect(
  mapStateToProps
  // mapActionsToProps
)(withStyles(styles)(ScreamDialog));
