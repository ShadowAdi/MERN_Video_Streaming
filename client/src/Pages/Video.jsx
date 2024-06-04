import styled from "styled-components";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { useEffect, useState } from "react";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { disLike, fetchSuccess, like } from "../redux/VideoSlice";
import { format } from "timeago.js";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { subscription } from "../redux/UserSlice";
import Recommendation from "../components/Recommendation";
import SharePopup from "../components/SharePopup";
import { toast } from "react-toastify";

const Container = styled.div`
  display: flex;
  align-items: start;
  gap: 24px;
  padding-bottom: 20px;
  @media (max-width: 1120px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  flex: 5;
  border-bottom: 1px solid #dadada;
  padding-bottom: 1.9rem;
  @media (max-width: 1120px) {
    width: 100%;
  }
  padding: 1rem 1.4rem;
`;

const VideoWrapper = styled.div``;

const VideoTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
  @media (max-width: 540px) {
    font-size: 18px;
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  margin-top: 8px;
  @media (max-width: 720px) {
    flex-direction: column-reverse;
    gap: 1rem;
    align-items: start;
    margin-top: 1rem;
  }
`;

const SelectedComp = styled.select`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  outline: none;
  cursor: pointer;
`;

const OPT = styled.option`
  color: #fff;
  background-color: #000;
`;

const Info = styled.div`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4em;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  border-radius: 25px;
  padding: 4px 10px;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.soft};
`;

const Hr = styled.hr`
  margin: 15px 0;
  border: 0.5px solid #dadada;
`;

const Channel = styled.div`
  display: flex;
  align-items: start;
  gap: 6px;
  justify-content: space-between;
  padding: 10px 10px;
  @media (max-width: 640px) {
    align-items: start;
    gap: 3rem;
    flex-direction: column;
  }
`;
const ChannelInfo = styled.div`
  display: flex;
  align-items: start;
  gap: 2rem;
  padding: 0 10px;
`;
const Subscribe = styled.button`
  padding: 6px 10px;
  color: white;
  background-color: #fe080a;
  border-radius: 3px;
  font-weight: 600;
`;
const Image = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  object-fit: cover;
  @media (max-width: 640px) {
    height: 40px;
    width: 40px;
  }
`;
const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
`;
const ChannelName = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;
const ChannelCount = styled.span`
  font-size: 16px;
  font-weight: medium;
  color: ${({ theme }) => theme.textSoft};
  margin-bottom: 6px;
`;
const Description = styled.p`
  font-size: 16px;
  ${"" /* font-weight:medium; */}
  color:${({ theme }) => theme.text}
`;

const VideoFrame = styled.video`
  max-height: 520px;
  object-fit: cover;
  width: 100%;
  cursor: pointer;
  @media (max-width: 720px) {
    max-height: 400px;
  }
`;

const VideoQuality = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

const Video = () => {
  const [selectedQuality, setSelectedQuality] = useState("360p");
  const { user } = useSelector((state) => state.user);
  const { video } = useSelector((state) => state.video);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];
  const [channelInfo, setChannelInfo] = useState({});
  const handleQualityChange = (event) => {
    setSelectedQuality(event.target.value);
  };
  const constructVideoUrl = (quality) => {
    const baseUrl = video?.videoUrl;
    const transformationString = {
      "360p": "", // No transformation for 360p
      "720p": "w_1280,h_720",
      "1080p": "w_1920,h_1080",
    }[quality];
    if (transformationString !== "360p") {
      const newVideoUrl = `${baseUrl}?${transformationString}`;
      return newVideoUrl;
    }
    // else {
    return baseUrl;
    // }
    // console.log(newVideoUrl);
  };
  const videoSource = constructVideoUrl(selectedQuality);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(
          "http://localhost:8080/api/videos/single/" + path
        );
        const channelRes = await axios.get(
          "http://localhost:8080/api/users/" + videoRes.data?.userId
        );
        setChannelInfo(channelRes?.data);
        dispatch(fetchSuccess(videoRes?.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [path, dispatch]);
  const handleLike = async () => {
    if (!user) {
      toast("Please Login");
      return;
    }
    try {
      await axios
        .put(
          `http://localhost:8080/api/users/like/${video?._id}`,
          {},
          { withCredentials: true }
        )
        .then(() => {
          dispatch(like(user?._id));
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };
  const handleDisLike = async () => {
    if (user) {
      try {
        await axios
          .put(
            `http://localhost:8080/api/users/Dislike/${video?._id}`,
            {},
            {
              withCredentials: true,
            }
          )
          .then(() => {
            dispatch(disLike(user?._id));
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    } else {
      toast("Please Login");
      return
    }
  };
  const handleSub = async () => {
    if (user) {
      user?.subscribedUsers?.includes(channelInfo?._id)
        ? await axios
            .put(
              `http://localhost:8080/api/users/unsub/${channelInfo?._id}`,
              {},
              { withCredentials: true }
            )
            .then(() => {
              toast("Channel UnSubscribed");
            })
            .catch(() => toast("There is an error"))
        : await axios
            .put(
              `http://localhost:8080/api/users/sub/${channelInfo?._id}`,
              {},
              { withCredentials: true }
            )
            .then(() => toast("Channel Subscribed"))
            .catch(() => toast("Server Error"));
      dispatch(subscription(channelInfo?._id));
    } else {
      toast("Please Login");
      return
    }
  };
  return (
    <>
      <Container>
        <Content>
          <VideoWrapper>
            <VideoFrame src={videoSource} controls />
          </VideoWrapper>

          <VideoQuality>
            <VideoTitle>{video?.title}</VideoTitle>
            <SelectedComp
              onChange={handleQualityChange}
              value={selectedQuality}
            >
              <OPT>360p </OPT>
              <OPT>720p </OPT>
              <OPT>1080p </OPT>
            </SelectedComp>
          </VideoQuality>

          <Details>
            <Info>
              {video?.views} views | {format(video?.createdAt)}
            </Info>
            <Buttons>
              <Button onClick={handleLike}>
                {video?.likes?.includes(user?._id) ? (
                  <FaThumbsUp />
                ) : (
                  <FaRegThumbsUp />
                )}

                {video?.likes?.length}
              </Button>
              <Button onClick={handleDisLike}>
                {video?.dislikes?.includes(user?._id) ? (
                  <FaThumbsDown />
                ) : (
                  <FaRegThumbsDown />
                )}
                Dislike
              </Button>
              <Button onClick={() => setOpen(!open)}>
                <FaShare />
                Share
              </Button>
            </Buttons>
          </Details>
          <Hr />
          <Channel>
            <ChannelInfo>
              <Image
                src={
                  channelInfo?.img ||
                  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                }
              />
              <ChannelDetail>
                <ChannelName>{channelInfo?.name}</ChannelName>
                <ChannelCount>
                  {channelInfo?.subscribers} Subscribers
                </ChannelCount>
                <Description>{video?.desc}</Description>
              </ChannelDetail>
            </ChannelInfo>
            <Subscribe onClick={handleSub}>
              {user?.subscribedUsers?.includes(channelInfo?._id)
                ? "UnSubscribe"
                : "Subscribe"}
            </Subscribe>
          </Channel>
          <Hr />
          <Comments videoId={video?._id} />
        </Content>
        <Recommendation tags={video?.tags}>
          {/* <Card type="sm" /> */}
        </Recommendation>
      </Container>
      {open && <SharePopup setOpen={setOpen} />}
    </>
  );
};

export default Video;
