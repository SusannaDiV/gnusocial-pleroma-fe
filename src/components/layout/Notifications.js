import React, { Component, Fragment } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import { connect } from 'react-redux';
import { getNotifications } from '../../redux/actions/userActions';
import axios from "axios";
import {SET_NOTIFICATIONS} from "../../redux/types";
import Checkbox from '@material-ui/core/Checkbox';

class Notifications extends Component {
    componentDidMount() {
        this.props.getNotifications();
    }
  state = {
    anchorEl: null
  };
  handleOpen = (event) => {
    this.setState({ anchorEl: event.target });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    //this.props.markNotificationsRead(unreadNotificationsIds);
  };

  markAllStatusRead = () => {
      axios
          .post('https://pleroma.site/api/v1/notifications/clear', null,{headers: {"Authorization": `Bearer ${localStorage.getItem('tokenStr')}`}})
          .then((res) => {
              console.log('all statuses marked seen ',res);
              this.props.getNotifications = [];
              this.render();
          })
          .catch((err) => {
              console.log('error while marking all statuses seen');
          });
  };

  setNotificationHeading = (not) => {
      const userName= not.account.acct;
      const time = dayjs(not.created_at).fromNow();

      if(not.type == 'like') { return userName + ' liked ' + ' your status ' + time; }
      else if(not.type == 'mention') { return userName + ' mentioned' + ' you on a status ' + time; }
      else if(not.type == 'follow') { return userName + ' followed you ' + time; }
      else if(not.type == 'favourite') { return userName + ' favourited your status ' + time; }
      else if(not.type == 'reblog') { return userName + ' reblogged your status ' + time; }
      else { return userName + ' notification ' + time; }
  };

  setNotificationContent = (not) => {

      if(not.type == 'favourite' || not.type == 'mention' || not.type == 'reblog'){
          var statusText = not.status.content.substring(0, 30);
          if(statusText.length > 1){
              return statusText;
          } else {
              return '';
          }
      } else {
          return '';
      }
  };

  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter((not) => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter((not) => not.read === false).length
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon />);
    } else {
      notificationsIcon = <NotificationsIcon />;
    }
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          const iconColor = not.pleroma.is_seen ? 'primary' : 'secondary';
          const icon =
            not.type === 'like' ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );

          return (
            <MenuItem key={not.created_at} onClick={this.handleClose}>
              {icon}
              <Typography
                color="default"
                variant="body1"
                to={`/users/${not.recipient}/status/${not.statusId}`}
              >
                  {this.setNotificationHeading(not)}
                  {<br></br> }
                  {this.setNotificationContent(not)}
                  {<br></br> }

              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );
    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <button
            className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white notification-button"
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </button>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          <Checkbox
        name="checkboxes"
        color="primary"
        onChange={() => this.markAllStatusRead()}
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      /> <span className='mr-8'> Mark all notifications as read</span>
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
    getNotifications: PropTypes.array.isRequired,
    markNotificationsRead: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications
});

export default connect(
  mapStateToProps,
  { getNotifications }
)(Notifications);
