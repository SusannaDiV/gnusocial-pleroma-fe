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
import { getCaptcha } from '../redux/actions/userActions';
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
      errors: {}
    };
  }

  componentDidMount(){
    console.log('Called Did Mount!!')
    axios
    .get('https://pleroma.site/api/pleroma/captcha')
    .then((res) => {
      // setAuthorizationHeader(res.data.token);
      console.log('Request Sent')
      console.log('Data Returned: ', res);
    })
  }

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
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      userName: this.state.userName
    };
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
  { signupUser }
)(withStyles(styles)(signup));