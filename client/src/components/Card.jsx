/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
// import { format } from "timeago.js";

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: ${({ type }) => (type === "sm" ? "row" : "column")};
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 305px; /* Set a fixed height */
  margin: 10px auto;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 5px;
  @media (max-width: 1720px) {
    width: 100%;
    margin: 20px auto;
  }

  @media (max-width: 920px) {
    width: 100%;
    margin: 20px auto;
  }

  @media (max-width: 520px) {
    width: 100%;
    margin: 20px auto;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 60%; /* Set a fixed height for the image container */
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensure the image covers the container */
  }
  @media (max-width: 1440px) {
    height: 60%;
  }
`;

const DescriptionContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 40%; /* Set a fixed height for the description container */
  @media (max-width: 1440px) {
    padding: 10px;
    height: 40%;
  }
`;

const VideoTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.text};
  @media (max-width: 920px) {
    font-size: 14px;
  }
`;

const ChannelName = styled.h3`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  margin: 0 0 4px 0;

  @media (max-width: 920px) {
    font-size: 14px;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  @media (max-width: 920px) {
    margin-top: 4px;
  }
`;

const ProfileDesc = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
  @media (max-width: 920px) {
    width: 20px;
    height: 20px;
  }
`;

const ProfileName = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const ProfileSub = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Btns = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 3.5rem;
`;

const DeleteButton = styled.button`
  padding: 0.1rem 0.2rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.textSoft};
`;

const EditButton = styled.button`
  padding: 0.1rem 0.2rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.textSoft};
`;

// eslint-disable-next-line no-unused-vars
const Card = ({ type, video, update }) => {
  const { user } = useSelector((state) => state.user);
  const [channelInfo, setChannelInfo] = useState({});
  const navigate = useNavigate();

  const fetchChannel = async () => {
    await axios
      .get("http://localhost:8080/api/users/" + video?.userId)
      .then((res) => {
        setChannelInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    video?.userId && fetchChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.userId]);

  const IncViews = async () => {
    if (user) {
      try {
        await axios
          .put(
            "http://localhost:8080/api/videos/view/" + video?._id,
            {},
            { withCredentials: true }
          )
          .then((res) => console.log(res?.data))
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const DeleteVideo = async () => {
    if (user) {
      try {
        await axios
          .delete("http://localhost:8080/api/videos/delete/" + video?._id, {
            withCredentials: true,
          })
          .then(() => navigate("/"))
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Link
      onClick={IncViews}
      className="w-full flex justify-between"
      to={`/video/${video?._id}`}
    >
      <VerticalContainer type={type}>
        <ImageContainer>
          <img src={video?.imgUrl} />
        </ImageContainer>
        <DescriptionContainer>
          <VideoTitle>
            {video?.title?.length > 20
              ? video?.title?.slice(0, 19) + "..."
              : video?.title}
          </VideoTitle>
          <ChannelName>{video?.views} Views</ChannelName>
          <Profile>
            <ProfileImage src={channelInfo?.img} />
            <ProfileDesc>
              <ProfileName>{channelInfo?.name}</ProfileName>
              <ProfileSub>{channelInfo?.subscribers} Subscribers</ProfileSub>
            </ProfileDesc>

            {user?._id===video?.userId && update && (
              <Btns>
                <DeleteButton onClick={DeleteVideo}>
                  <MdDeleteOutline
                    className="cursor-pointer"
                    size={22}
                    color="white"
                  />
                </DeleteButton>
                {user && (
                  <Link to={"/UpdateVideo/" + video?._id}>
                    <EditButton>
                      <MdEdit
                        className="cursor-pointer"
                        size={22}
                        color="black"
                      />
                    </EditButton>
                  </Link>
                )}
              </Btns>
            )}
          </Profile>
        </DescriptionContainer>
      </VerticalContainer>
    </Link>
  );
};

export default Card;
