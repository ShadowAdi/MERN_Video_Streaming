/* eslint-disable react/prop-types */
import styled from "styled-components";
import Comment from "./Comment";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchComments, addComment, updateComment } from "../redux/actions.js";
import { toast } from "react-toastify";

const Container = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
`;

const Avatar = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  object-fit: cover;
  @media (max-width: 640px) {
    height: 40px;
    width: 40px;
  }
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.bg};
  background-color: ${({ theme }) => theme.text};
  border-radius: 6px;
  padding: 10px 10px;
`;

const Input = styled.input`
  border: None;
  outline: None;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  background-color: transparent;
  padding: 5px;
  width: 100%;
`;

const H1 = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Comments = ({ videoId }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { comments } = useSelector((state) => state.comment);

  const [text, setText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    dispatch(fetchComments(videoId));
  }, [videoId, dispatch]);
  const handleAddOrUpdateComment = () => {
    if (user) {
      if (editingCommentId) {
        dispatch(updateComment(editingCommentId, text));
        setEditingCommentId(null);
      } else {
        dispatch(addComment(videoId, text));
      }
      setText("");
    }
    else{
      toast("Please Login")
    }
  };

  const handleEditClick = (comment) => {
    setText(comment.desc);
    setEditingCommentId(comment._id);
  };

  if (comments?.length < 1) {
    return (
      <Container>
        <NewComment>
          <Avatar
            src={
              user?.img ||
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
          />
          <Input
            onChange={(e) => setText(e?.target?.value)}
            placeholder="Enter Comment..."
            value={text}
          />
          <Btn onClick={handleAddOrUpdateComment}>Comment</Btn>
        </NewComment>
        <H1>No Comments Found</H1>
      </Container>
    );
  }

  return (
    <Container>
      <NewComment>
        <Avatar
          src={
            user?.img ||
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
        />
        <Input
          onChange={(e) => setText(e?.target?.value)}
          placeholder="Enter Comment..."
          value={text}
        />
        <Btn onClick={handleAddOrUpdateComment}>
          {" "}
          {editingCommentId ? "Update Comment" : "Comment"}
        </Btn>
      </NewComment>
      {comments?.map((comment, i) => {
        return (
          <Comment key={i} comment={comment} onEditClick={handleEditClick} />
        );
      })}
    </Container>
  );
};

export default Comments;
