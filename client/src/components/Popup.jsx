/* eslint-disable no-unused-vars */
import {  useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  z-index:9999;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 620px;
  background-color: ${({ theme }) => theme.bgSecond};
  color: ${({ theme }) => theme.text};
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.span`
  position: absolute;
  right: 10px;
  font-size: 18px;
  top: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;

const Popup = ({ setOpen }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const uploadFile = async (type) => {
    const data = new FormData();
    data.append("file", type === "image" ? images : video);
    data.append(
      "upload_preset",
      type === "image" ? "images_preset" : "videos_preset"
    );

    try {
      let resource_type = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/shadowaditya/${resource_type}/upload`;

      const res=await axios.post(api,data)
      console.log(res)
      const {secure_url}=res?.data
      console.log(secure_url)
      return secure_url
    } catch (error) {
      console.log(error);
    }
  };

  const uploadVideo = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const imgUrl = await uploadFile("image");
      const videoUrl = await uploadFile("video");

      const res = await axios.post(
        "http://localhost:8080/api/videos/create",
        {
          title,
          desc,
          imgUrl,
          videoUrl,
          tags,
        },
        {
          withCredentials: true,
        }
      );

      setImages(null)
      setVideo(null)
      setLoading(false)

      if (res.status === 200) {
        navigate(`/video/${res.data._id}`);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>
        <Label>Video:</Label>
        <Input
          onChange={(e) => setVideo(e.target.files[0])}
          type="file"
          accept="video/*"
        />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          name="title"
        />
        <Desc
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          name="desc"
          rows={4}
        />
        <Input
          onChange={(e) => setTags(e.target.value?.split(","))}
          type="text"
          placeholder="Separate the tags with commas."
        />
        <Label>Image:</Label>
        <Input
          onChange={(e) => setImages(e.target.files[0])}
          type="file"
          accept="image/*"
        />
        <Button onClick={uploadVideo}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Popup;
