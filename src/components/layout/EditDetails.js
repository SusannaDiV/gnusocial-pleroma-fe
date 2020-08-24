import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
// Redux stuff
import { connect } from "react-redux";
import { editUserDetails } from "../../redux/actions/userActions";
// MUI Stuff
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios, { patch } from "axios";
import { Typography } from "@material-ui/core";

const styles = (theme) => ({
  ...theme,
  button: {
    float: "right",
  },
});

class EditDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      name: "",
      note: "",
      open: false,
      file: null,
    };
    this.onChange = this.onChange.bind(this);
  }
  getUserProfile = async (id) => {
    await axios
      .get(`https://pleroma.site/api/v1/accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        this.setState({ note: res.data.note });
        this.setState({ name: res.data.display_name });
        this.setState({ avatar: res.data.avatar });
        console.log(
          "In edit profile to populate: ",
          this.state.name,
          this.state.avatar,
          this.state.note
        );

        this.render();
      })
      .catch(() => {});
  };
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }
  updateProfilePic = async () => {
    console.log("Changed Avatar: ", this.state.file);
    const url = "https://pleroma.site/api/v1/accounts/update_credentials";
    const formData = new FormData();
    formData.append("avatar", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
      },
    };
    return await patch(url, formData, config)
      .then((res) => {
        console.log("In edit avatar: ", res.data);
      })
      .catch(() => {});
  };
  updateProfileDetails = async (updatedData) => {
    const url = "https://pleroma.site/api/v1/accounts/update_credentials";
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
      },
    };
    return await patch(url, updatedData, config)
      .then((res) => {
        console.log("In edit profile details: ", res.data);
      })
      .catch(() => {});
  };
  mapUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : "",
    });
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
    // window.location.reload()
  };
  componentDidMount() {
    this.getUserProfile(localStorage.getItem("userId"));
  }

  handleChange = (event) => {
    console.log('Value changed: ', event)
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = async () => {
    const updatedData = {
      default_scope: "public",
      discoverable: false,
      display_name: this.state.name,
      hide_followers: false,
      hide_followers_count: false,
      hide_follows: false,
      hide_follows_count: false,
      locked: false,
      no_rich_text: false,
      note: this.state.note,
      show_role: true,
    };
    await this.updateProfileDetails(updatedData);
    await this.updateProfilePic();
    this.handleClose();
    window.location.reload()
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <button
          onClick={this.handleOpen}
          className="w3-button w3-block w3-theme-d2 w3-section"
          title="Decline"
        >
          <i className="fa fa-pencil" /> Edit
        </button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                tpye="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className={classes.textField}
                value={this.state.note}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="name"
                tpye="text"
                label="Name"
                placeholder="Your Name"
                className={classes.textField}
                value={this.state.name}
                onChange={this.handleChange}
                fullWidth
              />
              <Typography className={classes.textField}>
                <img
                  src={this.state.avatar ? this.state.avatar : ""}
                  className="w3-circle"
                  alt="Avatar"
                />
                <h3>Edit Avatar</h3>
                <input type="file" id="imageInput" onChange={this.onChange} />
                {/* <button
                  onClick={this.updateProfilePic}
                  className="w3-button w3-theme-d2 w3-section"
                  title="Save"
                >
                  Save Avatar
                </button> */}
              </Typography>
            </form>
          </DialogContent>
          <DialogActions>
            <button
              onClick={this.handleClose}
              className="w3-button w3-theme w3-section"
              title="Message"
            >
              Cancel
            </button>
            <button
              onClick={this.handleSubmit}
              className="w3-button w3-theme-d2 w3-section"
              title="Save"
            >
              Save
            </button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(EditDetails)
);
