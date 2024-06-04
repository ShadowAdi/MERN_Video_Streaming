import axios from 'axios';

// Action Types
export const FETCH_COMMENTS = 'FETCH_COMMENTS';
export const ADD_COMMENT = 'ADD_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const LIKE_COMMENT = 'LIKE_COMMENT';


// Action Creators
export const fetchComments = (videoId) => async (dispatch) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/comment/${videoId}`);
    dispatch({ type: FETCH_COMMENTS, payload: res.data });
  } catch (error) {
    console.error(error);
  }
};

export const addComment = (videoId, desc) => async (dispatch) => {
  try {
    const res = await axios.post(
      `http://localhost:8080/api/comment/add`,
      { videoId, desc },
      { withCredentials: true }
    );
    dispatch({ type: ADD_COMMENT, payload: res.data });
  } catch (error) {
    console.error(error);
  }
};

export const updateComment = (commentId, desc) => async (dispatch) => {
  try {
    const res = await axios.put(
      `http://localhost:8080/api/comment/${commentId}`,
      { desc },
      { withCredentials: true }
    );
    dispatch({ type: UPDATE_COMMENT, payload: res.data });
  } catch (error) {
    console.error(error);
  }
};

export const deleteComment = (commentId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:8080/api/comment/${commentId}`, { withCredentials: true });
    dispatch({ type: DELETE_COMMENT, payload: commentId });
  } catch (error) {
    console.error(error);
  }
};


export const likeComment = (commentId) => async (dispatch) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/comment/Like/${commentId}`,
        {},
        { withCredentials: true }
      );
      dispatch({ type: LIKE_COMMENT, payload: { commentId, data: res.data } });
    } catch (error) {
      console.error(error);
    }
  };