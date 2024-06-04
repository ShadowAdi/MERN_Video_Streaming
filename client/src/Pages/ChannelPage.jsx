import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { subscription } from "../redux/UserSlice";
import Card from "../components/Card";

const Container = styled.div`
  padding: 1rem 0.6rem;
  background-color: ${({ theme }) => theme.bg};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: start;
  justify-content: start;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: start;
    gap: 0.8rem;
  }
`;
const Videos = styled.div`
  width: 100%;
  ${"" /* background-color: red; */}
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: start;
  justify-content: space-between;
  @media (max-width: 1320px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
const AvatarImage = styled.img`
  height: 140px;
  width: 140px;
  border-radius: 50%;
  object-fit: cover;
  @media (max-width: 920px) {
    height: 100px;
    width: 100px;
  }
  @media (max-width: 720px) {
    height: 5em;
    width: 5em;
  }
`;

const H1 = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0;
  @media (max-width: 920px) {
    font-size: 1.6rem;
  }
  @media (max-width: 720px) {
    font-size: 1rem;
  }
`;
const H5 = styled.h5`
  font-size: 1rem;
  font-weight: 400;
  text-transform: capitalize;
  @media (max-width: 720px) {
    font-size: 0.8rem;
  }
`;

const Btn = styled.button`
  padding: 4px 10px;
  background-color: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.bgSecond};
  border-radius: 3px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Flex_between = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  @media (max-width: 720px) {
    gap: 1rem;
  }
  @media (max-width: 480px) {
    justify-content: space-between;
  }
`;

const Under_line = styled.div`
  height: 1.5px;
  width: 100%;
  background-color: ${({ theme }) => theme.text};
  wdith: 100%;
`;

const Heading = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const ChannelPage = () => {
  const { user } = useSelector((state) => state.user);
  const [channelInfo, setChannelInfo] = useState({});
  const [videos, setVideos] = useState([]);
  const { channelId } = useParams();
  const dispatch = useDispatch();

  const handleSub = async () => {
    user?.subscribedUsers?.includes(channelInfo?._id)
      ? await axios
          .put(
            `http://localhost:8080/api/users/unsub/${channelInfo?._id}`,
            {},
            { withCredentials: true }
          )
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
      : await axios
          .put(
            `http://localhost:8080/api/users/sub/${channelInfo?._id}`,
            {},
            { withCredentials: true }
          )
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
    dispatch(subscription(channelInfo?._id));
  };

  useEffect(() => {
    const fetchChannel = async () => {
      await axios
        .get("http://localhost:8080/api/users/" + channelId)
        .then((res) => setChannelInfo(res?.data))
        .catch((err) => console.log(err));
    };
    const fetchChannelVideos = async () => {
      await axios
        .get("http://localhost:8080/api/videos/User/" + channelId)
        .then((res) => setVideos(res?.data))
        .catch((err) => console.log(err));
    };
    fetchChannel();
    fetchChannelVideos();
  }, [channelId]);

  return (
    <Container>
      <ProfileSection>
        <Flex_between>
          <AvatarImage src={channelInfo?.img} />
          <TitleSection>
            <H1>{channelInfo?.name}</H1>
            <channelDesc>
              <H5>
                {" "}
                {channelInfo?.email} • {channelInfo?.subscribers} Subscribers •{" "}
                {videos.length > 0 && videos.length} Videos
              </H5>
            </channelDesc>
          </TitleSection>
        </Flex_between>
        <Btn onClick={handleSub}>
          {user?.subscribedUsers?.includes(channelInfo?._id)
            ? "UnSubscribe"
            : "Subscribe"}
        </Btn>
      </ProfileSection>
      <Under_line />
      <Heading>Videos</Heading>

      <Videos>
        {videos?.map((video, i) => (
          <Link to={`UpdateVideo/${video?._id}`} key={i}>
            <Card update={true} video={video} />
          </Link>
        ))}
      </Videos>
    </Container>
  );
};

export default ChannelPage;
