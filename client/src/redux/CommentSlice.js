import {
  FETCH_COMMENTS,
  ADD_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  LIKE_COMMENT
} from "./actions";

const initialState = {
  comments: [],
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMMENTS:
      return { ...state, comments: action.payload };
    case ADD_COMMENT:
      return { ...state, comments: [action.payload, ...state.comments] };
    case UPDATE_COMMENT:
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        ),
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment._id !== action.payload
        ),
      };
      case LIKE_COMMENT:
        return {
          ...state,
          comments: state.comments.map((comment) =>
            comment._id === action.payload.commentId
              ? {
                  ...comment,
                  Likes: comment.Likes.includes(action.payload.data.userId)
                    ? comment.Likes.filter((id) => id !== action.payload.data.userId)
                    : [...comment.Likes, action.payload.data.userId],
                }
              : comment
          ),
        };
    default:
      return state;
  }
};

export default commentsReducer;
