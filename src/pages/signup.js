import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import axios from "axios";
import Redirect from "react-router-dom/es/Redirect";

const styles = (theme) => ({
  ...theme,
});

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      userName: "",
      fullName: "",
      captcha_solution: "",
      captcha_answer_data: "",
      captcha_token: "",
      errors: {},
      error: ''
    };
  }

  componentDidMount() {
    this.getCaptcha();
  }

  getCaptcha = () => {
    axios.get("https://pleroma.site/api/pleroma/captcha").then((res) => {
      // setAuthorizationHeader(res.data.token);
      console.log("Captcha Data: ", res);
      this.state.captcha = res.data.url;
      this.state.captcha_answer_data = res.data.answer_data;
      this.state.captcha_token = res.data.token;
      this.setState({
        captcha: res.data.url,
      });
      console.log("Captcha State Data: ", this.state);
    })
        .catch((err) => {
          console.log('Errors: ', err);
          if(err.response.data.error === 'Invalid credentials'){
            this.state.error = 'Invalid Captcha. Please reload captcha image';
            this.render();
          }
          if (err === 'mfa_required') {
            // TODO: the sutff about multi factor authentication!
          }
        });
  };

  register = async (newUserData) => {
    console.log("Bearer to set in header", localStorage.getItem("tokenStr"));
    await axios
      .post("https://pleroma.site/api/v1/accounts", newUserData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        // setAuthorizationHeader(res.data.token);
        console.log("Register Data: ", res.data.access_token);
        localStorage.setItem("login_token", res.data.access_token);
      })
        .catch((err) => {
          console.log('Errors: ', err);
          if(err.response.data.error.includes('{"email":["has invalid format"]}')){
            this.state.error = 'Email has invalid format.';
          }
          else if(err.response.data.error.includes('{"email":["has already been taken"]}')){
            this.state.error = 'Email has already been taken.';
          }
          else if(err.response.data.error.includes('Invalid CAPTCHA')){
            this.state.error = 'Invalid Captcha, please click on the image to refresh the captcha.';
          }
          else if(err.response.data.error.includes('CAPTCHA already used')){
            this.state.error = 'Please click on the image to refresh the captcha.';
          }
          this.render();
          if (err === 'mfa_required') {
            // TODO: the sutff about multi factor authentication!
          }
        });
  };

  createApp = async (appData) => {
    await axios
      .post("https://pleroma.site/api/v1/apps", appData)
      .then((res) => {
        localStorage.setItem("client_id", res.data.client_id);
        localStorage.setItem("client_secret", res.data.client_secret);
      })
      .catch((err) => {
        console.log("Errors: ", err);
      });
  };

  oauthToken = async (oauthData) => {
    await axios
      .post("https://pleroma.site/oauth/token", oauthData)
      .then((res) => {
        if (res.identifier === "password_reset_required") {
          // TODO: Redirect to a password reset page!
          // logoutUser();
          return false;
        }
        localStorage.setItem("tokenStr", res.data.access_token);
      })
        .catch((err) => {
          console.log('Errors: ', err);
          if(err.response.data.error === 'Invalid credentials'){
            this.state.error = 'Your email/password is incorrect.';
            this.render();
          }
          if (err === 'mfa_required') {
            // TODO: the sutff about multi factor authentication!
          }
        });
  };

  verifyCreds = async () => {
    console.log(
      "Bearer to set in login header",
      localStorage.getItem("tokenStr")
    );
    await axios
      .get("https://pleroma.site/api/v1/accounts/verify_credentials", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenStr")}`,
        },
      })
      .then((res) => {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        this.setState({ isLoggedIn: true });
      })
      .catch((err) => {
        console.log("Errors: ", err);
        if(err.response.data.error.includes('Invalid credentials')){
          this.state.error = 'Invalid Credentials, please check again.';
        }
        this.render();
      });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const appData = {
      client_name:
        "gnusocial-fe_" + new Date().getDate() + "_" + new Date().getTime(),
      redirect_uris: "https://pleroma.site/oauth-callback",
      scopes: "read write follow push admin",
    };
    await this.createApp(appData);
    const oauthData = {
      client_id: localStorage.getItem("client_id"),
      client_secret: localStorage.getItem("client_secret"),
      grant_type: "client_credentials",
      redirect_uri: "https://pleroma.site/oauth-callback",
    };
    await this.oauthToken(oauthData);
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirm: this.state.confirmPassword,
      username: this.state.userName,
      fullname: this.state.fullName,
      captcha_token: this.state.captcha_token,
      captcha_solution: this.state.captcha_solution,
      captcha_answer_data: this.state.captcha_answer_data,
      bio: "Nothing!",
      agreement: true,
      locale: "en_US",
      nickname: this.state.userName,
    };
    await this.register(newUserData);
    await this.verifyCreds();
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to={{ pathname: "/" }} />;
    }
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;

    return (
      <div className="w3-card w3-round w3-white w3-padding">
        <Grid container className={classes.form}>
          <Grid item sm />
          <Grid item sm>
            <Typography variant="h4" className={classes.pageTitle}>
              SignUp
            </Typography>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                id="userName"
                name="userName"
                type="text"
                label="User Name"
                className={classes.textField}
                helperText={errors.userName}
                error={errors.userName ? true : false}
                value={this.state.userName}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                id="fullName"
                name="fullName"
                type="text"
                label="Full Name"
                className={classes.textField}
                helperText={errors.fullName}
                error={errors.fullName ? true : false}
                value={this.state.fullName}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                className={classes.textField}
                helperText={errors.email}
                error={errors.email ? true : false}
                value={this.state.email}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                id="password"
                name="password"
                type="password"
                label="Password"
                className={classes.textField}
                helperText={errors.password}
                error={errors.password ? true : false}
                value={this.state.password}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                className={classes.textField}
                helperText={errors.confirmPassword}
                error={errors.confirmPassword ? true : false}
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                fullWidth
              />
              <Typography
                align="left"
                component="div"
                onClick={this.getCaptcha}
                style={{
                  backgroundImage: `url(${this.state.captcha})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left",
                  height: "20vh",
                  width: "40vh",
                }}
              />
              <Typography variant="caption" display="block">
                Click on Image to reload!!
              </Typography>
              <TextField
                id="captcha_solution"
                name="captcha_solution"
                type="text"
                label="Enter Captcha"
                className={classes.textField}
                helperText={errors.captcha_solution}
                error={errors.captcha_solution ? true : false}
                value={this.state.captcha_solution}
                onChange={this.handleChange}
                variant="outlined"
                fullWidth
              />
              {this.state.error.length > 0 && (
                  <Typography variant="body2" className={classes.customError}>
                    {this.state.error}
                  </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w3-button w3-theme-d2 w3-section"
                disabled={loading}
              >
                SignUp
                {loading && (
                  <CircularProgress
                    color="secondary"
                    size={30}
                    className={classes.progress}
                  />
                )}
              </Button>
              <br />
              <small>
                Already have an account? Login <Link to="/login">here</Link>
              </small>
            </form>
          </Grid>
          <Grid item sm />
        </Grid>
      </div>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  // signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(
  mapStateToProps
  // { signupUser, createApp, oauthToken }
)(withStyles(styles)(signup));
