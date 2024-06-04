/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars

import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
  display: flex;
  overflow: hidden;
  width: ${({ type }) => (type === "sm" ? "400px" : "500px")};
  margin: 10px auto;
  gap: 16px;
  padding: 3px 2px;
  align-items: start;
  width: 100%;
  @media (max-width: 720px) {
    gap: 10px;
  }
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
  transition: all 0.7s ease;
`;

const ImageContainer = styled.div`
  flex: 1;
  min-width: ${({ type }) => (type === "sm" ? "200px" : "250px")};
  max-width: "250px";
  max-height: 120px;
  @media (max-width: 720px) {
    flex: 0.4;
    min-width: ${({ type }) => (type === "sm" ? "200px" : "130px")};
  }
`;

const CImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;
const ChannelName = styled.h3`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  @media (min-width: 720px) {
    font-size: 14px;
  }
`;
const DescriptionContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const VideoTitle = styled.h2`
  font-size: ${({ type }) => type === "sm" && "18px"}
  ${"" /* margin: 0 0 8px 0; */}
  color:${({ theme }) => theme.text};
  text-transform:capitalize;
  @media (max-width: 720px) {
    font-size: 14px;
  }
`;

const SecTitle = styled.h2`
  font-size: 24px;
  color: ${({ theme }) => theme.text};
  text-transform: capitalize;
  font-weight: 600;
  @media (max-width: 720px) {
    font-size: 16px;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;
  gap: 10px;
  @media (max-width: 720px) {
    flex-direction: column;
    align-items: start;
  }
`;

const ProfileName = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  @media (max-width: 720px) {
    font-size: 14px;
  }
`;

const DescP = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  margin-top: 4px;
  @media (max-width: 720px) {
    font-size: 10px;
  }

`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content:space-between;
  @media (max-width: 720px) {
    flex-direction: column;
    gap: 0.4rem;
    align-items: start;
  }
`;

const VideoBox = ({ video, type, hist }) => {
  const [channelInfo, setChannelInfo] = useState({});

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
  return (
    <Link to={"/Video/" + video?._id} className="w-full ">
      <Container type={type}>
        <ImageContainer type={type}>
          <CImage src={video?.imgUrl} />
        </ImageContainer>
        <DescriptionContainer>
          {hist ? (
            <SecTitle>{video?.title}</SecTitle>
          ) : (
            <VideoTitle type="hj">{video?.title}</VideoTitle>
          )}
          {hist ? (
            <Profile>
              <ChannelName>{channelInfo?.name} ||</ChannelName>
              <ProfileName>{video?.views} Views </ProfileName>
            </Profile>
          ) : (
            <ChannelName>{channelInfo?.name}</ChannelName>
          )}

          {!hist ? (
            <FlexDiv>
              <DescP>{format(video?.createdAt)}</DescP>
              <ProfileName>{video?.views} Views </ProfileName>
            </FlexDiv>
          ) : (
            <></>
          )}

          {hist ? (
            video?.desc?.length > 150 ? (
              <DescP>{video?.desc?.slice(0, 150)}...</DescP>
            ) : (
              <DescP>{video?.desc}</DescP>
            )
          ) : (
            <></>
          )}
        </DescriptionContainer>
      </Container>
    </Link>
  );
};

export default VideoBox;
