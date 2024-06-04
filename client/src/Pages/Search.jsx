import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 30px 20px;
  align-items:start;
  justify-content: space-around;

  @media (max-width:1496px){
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px 20px;
  }
  @media (max-width:1096px){
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px 20px;
  }
  @media (max-width:720px){
    grid-template-columns: repeat(1, 0.8fr);
    grid-gap: 10px 20px;
  }
`;
const Search = () => {
  const [videos, setVideos] = useState([]);
  const q = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      await axios
        .get(`http://localhost:8080/api/videos/search${q}`)
        .then((res) => {
          setVideos(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchVideos();
  }, [q]);

  return (
    <Container>
      {videos?.map((video, i) => {
        return <Card key={i} video={video} />;
      })}
    </Container>
  );
};

export default Search;
