import {
  SET_CURRENT_USER,
  SET_SCREAMS,
  SET_POSTS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  SET_ERRORS,
  POST_SCREAM,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_SCREAM,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from '../types';
import axios from 'axios';

export const getPosts = () => (dispatch) => {
    let isUserLoggedIn = localStorage.getItem('tokenStr');

    dispatch({ type: LOADING_DATA });

    if(isUserLoggedIn == null){ // public timeline posts
        axios
            .get('https://pleroma.site/api/v1/timelines/public?local=true&only_media=false&count=20&with_muted=true', )
            .then((res) => {
                dispatch({
                    type: SET_POSTS,
                    payload: res.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: SET_POSTS,
                    payload: []
                });
            });
    } else { // logged in user timeline posts
        axios
            .get('https://pleroma.site/api/v1/timelines/home?count=20&with_muted=true', { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`} })
            .then((res) => {
                dispatch({
                    type: SET_POSTS,
                    payload: res.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: SET_POSTS,
                    payload: []
                });
            });
    }
};

// Get all screams
export const getScreams = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('/screams')
    .then((res) => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_SCREAMS,
        payload: []
      });
    });
};
export const getScream = (screamId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/scream/${screamId}`)
    .then((res) => {
      dispatch({
        type: SET_SCREAM,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};
// Post a Status
export const postStatus = (status) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('https://pleroma.site/api/v1/statuses', status,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`} })
    .then((res) => {
      dispatch({
        type: POST_SCREAM,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
export const submitComment = (screamId, commentData) => (dispatch) => {
  axios
    .post(`/scream/${screamId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
export const deleteScream = (screamId) => (dispatch) => {
  axios
    .delete(`/scream/${screamId}`)
    .then(() => {
      dispatch({ type: DELETE_SCREAM, payload: screamId });
    })
    .catch((err) => console.log(err));
};

export const getUserData = (id) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
      .get(`https://pleroma.site/api/v1/accounts/${id}/statuses`, { headers: {"Authorization" : `Bearer ${localStorage.getItem('tokenStr')}`} })
    .then((res) => {
      dispatch({
        type: SET_POSTS,
        payload: res.data
      });
      /*if(user.credentials.handle !== userHandle){
        dispatch({
          type: SET_POSTS,
          payload: res.data.user
        })
      }*/
    })
    .catch(() => {
      dispatch({
        type: SET_POSTS,
        payload: []
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
