/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import styled from "styled-components";
import { format } from "timeago.js";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { deleteComment, likeComment } from "../redux/actions";
import { toast } from "react-toastify";
const Container = styled.div`
  display: flex;
  align-items: start;
  gap: 30px;
  &:hover: {
    background-color: ${({ theme }) => theme.soft};
  }
  position: relative;
`;

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;
const Heads = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const H1 = styled.h1`
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
`;
const Span = styled.span`
  color: ${({ theme }) => theme.textSoft};
  font-weight: 400;
  font-size: 12px;
`;
const DropDownVertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.soft};
  position: absolute;
  top: 30px;
  right: -150px;
  gap: 20px;
`;

const H5 = styled.h5`
  font-size: 18px;
  font-weight: 400;
`;
const Comment = ({ comment, onEditClick }) => {
  const { user } = useSelector((state) => state.user);
  const [enter, setEnter] = useState(false);
  const [dropdown, setDropDown] = useState(false);

  const [commentInfo, setCommentInfo] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComments = async () => {
      if (comment?.userId) {
        try {
          await axios
            .get(`http://localhost:8080/api/users/${comment?.userId}`)
            .then((res) => {
              setCommentInfo(res?.data);
            })
            .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
        }
      } else {
        return;
      }
    };
    fetchComments();
  }, [comment]);

  const handleLikeComment = () => {
    if (user) {
      dispatch(likeComment(comment._id));
    } else {
      toast("Please Login");
    }
  };

  const handleDeleteComment = () => {
    if (user) {
      dispatch(deleteComment(comment._id));
    } else {
      toast("Please Login");
    }
  };

  const OpeningDropdown = () => {
    if (user?.id === comment?.userId) {
      setDropDown(false);
    } else {
      setDropDown(true);
    }
  };

  return (
    <Container
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
    >
      <Avatar
        src={
          commentInfo?.img ||
          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
        }
      />
      <Details>
        <Heads>
          <H1>{commentInfo?.name}</H1>
          <Span>{format(comment?.createdAt)}</Span>
        </Heads>
        <p>{comment?.desc}</p>
        <div className="flex align-middle items-center gap-4 mt-3">
          <p>{comment?.Likes?.length} Likes</p>

          <FaThumbsUp onClick={handleLikeComment} cursor="pointer" size={18} />
        </div>
      </Details>
      {enter && (
        <BsThreeDotsVertical
          onClick={OpeningDropdown}
          className="absolute right-0 top-0 cursor-pointer"
          size={22}
        />
      )}
      {user && commentInfo?._id === comment?.userId && dropdown && (
        <DropDownVertical>
          {commentInfo?._id === comment?.userId && (
            <H5 className="cursor-pointer" onClick={() => onEditClick(comment)}>
              Edit Comment
            </H5>
          )}
          {commentInfo?._id === comment?.userId && (
            <H5
              className="cursor-pointer"
              onClick={() => handleDeleteComment()}
            >
              Delete Comment
            </H5>
          )}
        </DropDownVertical>
      )}
    </Container>
  );
};

export default Comment;
