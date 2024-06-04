/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  @media (max-width: 520px) {
    padding: 2px 1px;
  }

`;

const Wrapper = styled.div`
  width: 600px;
  height: 680px;
  background-color: ${({ theme }) => theme.bgSecond};
  color: ${({ theme }) => theme.text};
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
  @media (max-width: 520px) {
    padding: 2px 3px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  @media (max-width: 520px) {
    font-size: 24px;
  }
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
  padding-bottom: 16px;
  @media (max-width: 520px) {
    padding: 3px;
    padding-bottom:10px;
  }
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
  transition: all 0.6s ease-in;
  &:hover {
    background-color: #ff0000;
    color: #fff;
  }

  @media (max-width: 520px) {
    padding: 10px 6px;
  }
`;

const Label = styled.label`
  font-size: 14px;
`;

const CreateVideo = () => {
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

      const res = await axios.post(api, data);
      const { secure_url } = res?.data;
      return secure_url;
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

      setImages(null);
      setVideo(null);
      setLoading(false);

      if (res.status === 200) {
        navigate(`/video/${res.data._id}`);
        toast("Video has been Created")
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading video:", error);
    }
  };
  return (
    <Container>
      <Wrapper>
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
        {loading ? (
          <div className="w-full m-0 flex items-center justify-center align-middle">
            <InfinitySpin
              visible={true}
              width="200"
              color="#FF0000"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        ) : (
          <Button onClick={uploadVideo}>Upload</Button>
        )}
      </Wrapper>
    </Container>
  );
};

export default CreateVideo;
