import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';
import { createApp } from '../redux/actions/userActions';
import { oauthToken } from '../redux/actions/userActions';
import axios from 'axios';

const styles = (theme) => ({
  ...theme
});

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      userName: '',
      fullName: '',
      captcha_solution: '',
      captcha_answer_data: '',
      captcha_token: '',
      errors: {}
    };
  }

  componentDidMount(){
    this.getCaptcha();
  }

  getCaptcha = () => {
    axios
    .get('https://pleroma.site/api/pleroma/captcha')
    .then((res) => {
      // setAuthorizationHeader(res.data.token);
      console.log('Captcha Data: ', res)
      this.state.captcha = res.data.url;
      this.state.captcha_answer_data = res.data.answer_data;
      this.state.captcha_token = res.data.token;
      this.setState({
        captcha: res.data.url
      });
      console.log('Captcha State Data: ', this.state);
    })
 };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const appData = {
      client_name: "gnusocial-fe_"+new Date().getDate()+"_"+new Date().getTime(),
      redirect_uris: "https://pleroma.site/oauth-callback",
      scopes: "read write follow push admin"
    };
    console.log('App Data: ', appData);
    this.props.createApp(appData, this.props.history);
    
    console.log('Oauth Returned Data: ', localStorage.getItem('client_id'));
    const oauthData = {
      client_id: localStorage.getItem('client_id'),
      client_secret: localStorage.getItem('client_secret'),
      grant_type: "client_credentials",
      redirect_uri: "https://pleroma.site/oauth-callback"
    }
    console.log('Oauth Data: ', oauthData);
    this.props.oauthToken(oauthData,this.props.history);
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      userName: this.state.userName,
      fullName: this.state.fullName,
      captcha_token: this.state.captcha_token,
      captcha_solution: this.state.captcha_solution,
      captcha_answer_data: this.state.captcha_answer_data
    };
    console.log('User Data: ', newUserData);
    this.props.signupUser(newUserData, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
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
                  style={{
                    backgroundImage:`url(${this.state.captcha})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left",
                    height: "20vh",
                    width: "40vh"
                  }}
                />
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
              {errors.general && (
                <Typography variant="body2" className={classes.customError}>
                  {errors.general}
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
                  <CircularProgress color="secondary" size={30} className={classes.progress} />
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
  signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { signupUser, createApp, oauthToken }
)(withStyles(styles)(signup));