import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ
} from '../types';
import axios from 'axios';

export const loginUser = async (history) => {
  // dispatch({ type: LOADING_UI });
  console.log('Bearer to set in header', localStorage.getItem('tokenStr'))
  await axios
    .post('https://pleroma.site/api/v1/accounts/verify_credentials', { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`} })
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      // dispatch(getUserData());
      // dispatch({ type: CLEAR_ERRORS });
      history.push('/');
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data
      // });
    });
};

export const signupUser = async (newUserData,history) => {
  // dispatch({ type: LOADING_UI });
  console.log('Bearer to set in header', localStorage.getItem('tokenStr'))
  await axios
    .post('https://pleroma.site/api/v1/accounts', newUserData, { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`} })
    .then((res) => {
      // setAuthorizationHeader(res.data.token);
      // dispatch(getUserData());
      // dispatch({ type: CLEAR_ERRORS });
      history.push('/');
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data
      // });
    });
};

export const createApp = async (appData,history) => {
  // dispatch({ type: LOADING_UI });
  await axios
    .post('https://pleroma.site/api/v1/apps', appData)
    .then((res) => {
      // setAuthorizationHeader(res.data.token);
      // dispatch(getUserData());
        localStorage.setItem('client_id', res.data.client_id);
      localStorage.setItem('client_secret', res.data.client_secret);
      // dispatch({ type: CLEAR_ERRORS });
      history.push('/');
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data
      // });
    });
};

export const oauthToken = (oauthData, history) => {
  // dispatch({ type: LOADING_UI });
   axios
    .post('https://pleroma.site/oauth/token', oauthData)
    .then((res) => {
      if (res.identifier === 'password_reset_required') {
        // TODO: Redirect to a password reset page!
        logoutUser();
        return false
       }
      //  console.log('access_token: ', res.data.access_token);
    localStorage.setItem('tokenStr', res.data.access_token);
      // setAuthorizationHeader(res.data.access_token);
      // dispatch({ type: CLEAR_ERRORS });
      history.push('/');
    })
    .catch((err) => {
        if (err === 'mfa_required') {
       // TODO: the sutff about multi factor authentication!
     }
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data
      // });
    });
};


export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('tokenStr');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('login_token');
  localStorage.removeItem('client_id');
  localStorage.removeItem('client_secret');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get('/user')
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post('/user/image', formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post('/user', userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios
    .post('/notifications', notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ
      });
    })
    .catch((err) => console.log(err));
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  console.log('access_token_bearer: ', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};
