import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Redirect from "react-router-dom/es/Redirect";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import axios from 'axios';

const styles = (theme) => ({
  ...theme
});

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
      error: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  createApp = async (appData) => {
    await axios
      .post('https://pleroma.site/api/v1/apps', appData)
      .then((res) => {
        localStorage.setItem('client_id', res.data.client_id);
        localStorage.setItem('client_secret', res.data.client_secret);
      })
      .catch((err) => {
        console.log('Errors: ', err);
      });
  };
  
  oauthToken = async (oauthData) => {
     await axios
      .post('https://pleroma.site/oauth/token', oauthData)
      .then((res) => {
        if (res.identifier === 'password_reset_required') {
          // TODO: Redirect to a password reset page!
          // logoutUser();
          return false
         }
      localStorage.setItem('tokenStr', res.data.access_token);
      })
      .catch((err) => {
        console.log('Errors: ', err);
        if(err.response.data.error == 'Invalid credentials'){
          this.state.error = 'Your email/password is incorrect.';
          this.render();
        }
          if (err === 'mfa_required') {
         // TODO: the sutff about multi factor authentication!
       }
      });
  };
  
  verifyCreds = async () => {
    console.log('Bearer to set in login header', localStorage.getItem('tokenStr'))
    await axios
      .get('https://pleroma.site/api/v1/accounts/verify_credentials', { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`} })
      .then((res) => {
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('userId', res.data.id);
        axios.defaults.headers.common['Authorization'] =`Bearer ${res.data.token}`;
        this.setState({ isLoggedIn: true });
      })
      .catch((err) => {
        console.log('Errors: ', err);
      });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const appData = {
      client_name: "gnusocial-fe_"+new Date().getDate()+"_"+new Date().getTime(),
      redirect_uris: "https://pleroma.site/oauth-callback",
      scopes: "read write follow"
    };
    console.log('App Data: ', appData);
    await this.createApp(appData);
    
    console.log('Oauth Returned Data: ', localStorage.getItem('client_id'));
    const oauthData = {
      client_id: localStorage.getItem('client_id'),
      client_secret: localStorage.getItem('client_secret'),
      grant_type: "password",
      username: this.state.email,
      password: this.state.password
    }
    console.log('Oauth Data: ', oauthData);
    await this.oauthToken(oauthData);
    await this.verifyCreds();
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to = {{ pathname: "/" }} />;
    }
    const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors } = this.state;

    return (
      <div className="w3-card w3-round w3-white w3-padding">
        <Grid container className={classes.form}>
          <Grid item sm />
          <Grid item sm>
            <Typography variant="h4" className={classes.pageTitle}>
              Login
          </Typography>
            <form noValidate onSubmit={this.handleSubmit}>
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
                Login
              {loading && (
                  <CircularProgress color="secondary" size={30} className={classes.progress} />
                )}
              </Button>
              <br />
              <small>
                Don't have an account? Sign up <Link to="/signup">here</Link>
              </small>
            </form>
          </Grid>
          <Grid item sm />
        </Grid>
      </div>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

// const mapActionsToProps = {
//   loginUser
// };

export default connect(
  mapStateToProps,
  // mapActionsToProps
)(withStyles(styles)(login));
