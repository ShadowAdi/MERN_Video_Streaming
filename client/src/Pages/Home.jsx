import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
import { useState, useEffect } from "react";
import VideoBox from "../components/VideoBox";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 30px 20px;
  align-items: start;
  justify-content: space-around;
  height: 100%;

  @media (max-width: 1496px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px 20px;
  }
  @media (max-width: 1096px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px 20px;
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(1, 0.8fr);
    grid-gap: 10px 20px;
  }
`;

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: start;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 1.6rem;
  margin-bottom: 0.8rem;
`;

const Section = styled.section`
  margin-bottom: 20px;
  max-width: 50%;
  padding-bottom: 6px;
  @media (max-width: 1440px) {
    max-width: 90%;
    max-height: 60%;
  }
`;

const UnderLine = styled.div`
  background-color: #fff;
  width: 100%;
  height: 1.5px;
`;

const H1 = styled.h1`
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const TitleH1 = styled.h1`
  text-align: left;
  font-size: 42px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  @media (max-width: 1440px) {
    font-size: 32px;
  }
`;

const H3 = styled.h3`
  text-align: left;
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 1rem 0;
  @media (max-width: 1440px) {
    font-size: 16px;
  }
`;

// eslint-disable-next-line react/prop-types
const Home = ({ type }) => {
  const [videos, setVideos] = useState({ today: [], yesterday: [], older: [] });

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get("http://localhost:8080/api/videos/" + type, {
        withCredentials: true,
      });

      if (type === "History") {
        setVideos(res.data);
      } else {
        setVideos({ today: res.data, yesterday: [], older: [] });
      }
    };

    fetchVideos();
  }, [type]);

  if (
    videos?.today?.length < 1 &&
    videos?.older?.length < 1 &&
    videos?.yesterday?.length < 1
  ) {
    return (
      <Container>
        <h1 className="text-center text-xl font-bold">No Video Found</h1>
      </Container>
    );
  }

  if (type === "History") {
    return (
      <HistoryContainer>
        <TitleH1>Watch History</TitleH1>
        <Section>
          <H3>Today</H3>
          <Content>
            {videos.today.length > 0 ? (
              videos.today.map((video, i) => {
                return <VideoBox key={i} video={video?.video} hist={true} />;
              })
            ) : (
              <H1>No Videos Watched Today</H1>
            )}
          </Content>
        </Section>
        <UnderLine />

        <Section>
          <H3>Yesterday</H3>
          <Content>
            {videos.yesterday.length > 0 ? (
              videos.yesterday.map((video, i) => {
                return <VideoBox key={i} video={video?.video} />;
              })
            ) : (
              <H1>No Videos Watched Yesterday</H1>
            )}
          </Content>
        </Section>
        <UnderLine />

        <Section>
          <H3>Older</H3>
          <Content>
            {videos.older.length > 0 ? (
              videos.older.map((video, i) => {
                if (video?.video) {
                  return <VideoBox key={i} video={video.video} />;
                } 
              })
            ) : (
              <H1>No Older Videos</H1>
            )}
          </Content>
        </Section>
        <UnderLine />
      </HistoryContainer>
    );
  }

  return (
    <Container>
      {videos.today.map((video, i) => (
        <Card key={i} video={video} />
      ))}
    </Container>
  );
};

export default Home;
