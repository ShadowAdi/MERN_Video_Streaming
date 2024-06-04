/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import VideoBox from "./VideoBox";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 28px;
  flex: 3;
`;

const H1=styled.h1`
font-size:26px;
font-weight:700;
color:${({theme})=>theme.text}
`
const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fectchByTags = async () => {
      try {
        await axios
          .get(`http://localhost:8080/api/videos/tags?tags=${tags}`)
          .then((res) => {
            setVideos(res?.data);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    };
    fectchByTags();
  }, [tags]);

  if (videos?.length<1) {
    return <H1 >No Videos Found</H1>
  }

  return (
    <Container>
      {videos?.map((video, i) => {
        
        return <VideoBox   key={i} type={"sm"} video={video} />;
      })}
    </Container>

  );
};

export default Recommendation;
