import {
  SET_SCREAMS,
  SET_POSTS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SUBMIT_COMMENT,
  SET_CURRENT_USER,
  SET_FAVOURITES
} from '../types';

const initialState = {
  screams: [],
  scream: {},
  currentUser: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
        currentUser: null
      };
    case SET_FAVOURITES:
      return {
        ...state,
        posts: action.payload,
        loading: false,
        currentUser: null
      };
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false,
        currentUser: null
      };
    case SET_SCREAM:
      return {
        ...state,
        commentsPosts: action.payload,
        loadingPosts: false,
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likedData: action.payload,
        loading: false,
        currentUser: null
      };
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      state.screams[index] = action.payload;
      if (state.scream.screamId === action.payload.screamId) {
        state.scream = action.payload;
      }
      return {
        ...state
      };
    case DELETE_SCREAM:
      index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload
      );
      state.screams.splice(index, 1);
      return {
        ...state
      };
    case POST_SCREAM:
      return {
        ...state,
        screams: [action.payload, ...state.screams]
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [action.payload, ...state.scream.comments]
        }
      };
    default:
      return state;
  }
}