import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import ProfileSkeleton from '../../util/ProfileSkeleton';
// MUI stuff
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';

//Redux
import { connect } from 'react-redux';
import { uploadImage } from '../../redux/actions/userActions';

const styles = (theme) => ({
  ...theme
});

class ProfileTile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated
      }
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <div>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
          <link rel="stylesheet" href="listnav.css" />
          <style dangerouslySetInnerHTML={{ __html: "\nhtml, body, h1, h2, h3, h4, h5 {font-family: \"Open Sans\", sans-serif}\n" }} />

          <div className="w3-col m3">
            <div className="w3-card w3-round w3-white">
              <div className="w3-container">
                <p className="w3-center">
                  <img src={imageUrl} className="w3-circle" style={{ height: '106px', width: '106px' }} alt="Avatar" />
                  <input
                    type="file"
                    id="imageInput"
                    hidden="hidden"
                    onChange={this.handleImageChange}
                  />
                </p>
                <div className="w3-center"><strong>
                  <MuiLink
                    component={Link}
                    to={`/users/${handle}`}
                    variant="h5"
                  >
                    @{handle}
                  </MuiLink></strong>
                  {bio && <Typography variant="body2">{bio}</Typography>}
                  <hr />
                  {location && (
                    <Fragment>
                      <LocationOn color="primary" /> <span>{location}</span>
                      <hr />
                    </Fragment>
                  )}
                  {website && (
                    <Fragment>
                      <LinkIcon color="primary" />
                      <a href={website} target="_blank" rel="noopener noreferrer">
                        {' '}
                        {website}
                      </a>
                    </Fragment>
                  )}
                </div>
                <p><i className="fa fa-arrow-right fa-fw w3-margin-right w3-text-theme" /> Following <span className="w3-right "><strong>1</strong></span></p>
                <p><i className="fa fa-thumbs-up fa-fw w3-margin-right w3-text-theme" /> Followers <span className="w3-right "><strong>1</strong></span></p>
              </div>
              <div className="w3-container">
                <div className="w3-half ">
                  <button className="w3-button w3-block w3-theme w3-section" title="Message"><i className="fa fa-comment" />  Message</button>
                </div>
                <div className="w3-half">
                  <button className="w3-button w3-block w3-theme-d2 w3-section" title="Decline"><i className="fa fa-pencil" />  Edit</button>
                </div> <EditDetails />
              </div>
            </div>
            <br />
            <div className="w3-card w3-round w3-white">
              <div className="w3-container">
                <p><strong>Statistics</strong></p>
                <p><i className="fa fa-user fa-fw w3-margin-right w3-text-theme" /> User ID <strong>69413</strong></p>
                <p><i className="fa fa-clock-o fa-fw w3-margin-right w3-text-theme" /> Member since <strong><span>{dayjs(createdAt).format('DD MMM YYYY')}</span></strong></p>
                <p><i className="fa fa-calendar fa-fw w3-margin-right w3-text-theme" /> Daily average <strong>0</strong></p>
              </div>
            </div>
            <br />
          </div>
        </div>
      ) : (
        <Paper className={classes.paper + ' w3-col m3'}>
          <Typography variant="body2" align="center">
            No profile found, please login again
          </Typography>
          <div className="w3-row">
            <div className="w3-col m6"><button className="btn w3-button w3-block w3-theme w3-section"><Link to="/login">Login</Link></button></div>
            <div className="w3-col m6"><button className="btn w3-button w3-block w3-theme-d2 w3-section"><Link to="/signup">Signup</Link></button></div>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );
    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = { uploadImage };

ProfileTile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ProfileTile));