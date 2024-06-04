/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUserSuccess } from "../redux/UserSlice";
import { toast } from "react-toastify";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  flex-direction: column;
  gap: 2rem;
  @media (max-width: 520px) {
    padding: 2px 1px;
  }
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
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

const Desc = styled.input`
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
  };
  @media (max-width: 520px) {
    padding: 10px 6px;
  }
`;

const Label = styled.label`
  font-size: 14px;
`;

const ImageCircular = styled.img`
  height: 80px;
  width: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto;
`;

const Wrapper2 = styled.div`
  background-color: red;
  width: 600px;
  background-color: ${({ theme }) => theme.soft};
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

const H1Delete = styled.h1`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  text-align: center;
  @media (max-width: 520px) {
    font-size: 1.2rem;

  }
`;

const DeleteBtn = styled.button`
  padding: 8px 12px;
  background-color: #ff0000;
  color: #fff;
  width: 30%;
  margin: 0 auto;
  margin-bottom: 8px;
  @media (max-width: 520px) {
    padding: 8px 3px;
    width: 60%;

  }
`;

const Update = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [image, setImage] = useState(undefined);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentImg, setCurrentImg] = useState(user?.img || "");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "images_preset");

    try {
      let resource_type = "image";
      let api = `https://api.cloudinary.com/v1_1/shadowaditya/${resource_type}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res?.data;
      return secure_url;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imgUrl = currentImg;
      if (image) {
        imgUrl = await uploadFile();
      }

      const res = await axios.put(
        "http://localhost:8080/api/users/" + user?._id,
        {
          name,
          email,
          img: imgUrl,
        },
        {
          withCredentials: true,
        }
      );

      setImage(null);
      setLoading(false);

      if (res.status === 200) {
        dispatch(updateUserSuccess({ name, email, img: imgUrl }));
        navigate(`/`);
        toast("User Has Been Updated")
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating user:", error);
    }
  };

  const DeleteAccount = async (e) => {
    alert(
      "Are You sure You Want to Delete Your Account. It Will Also Delete Your Videos"
    );
    await axios
      .delete("http://localhost:8080/api/users/" + user?._id,{withCredentials:true})
      .then((res) => {
        navigate("/")
        toast("User Has Been Deleted")
        dispatch(logout());

      })
      .catch((err) => console.log(err));
  };

  // console.log(URL.createObjectURL(image))

  return (
    <Container>
      <Wrapper>
        <Title>Update User Profile</Title>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
          name="name"
        />
        <Desc
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          name="email"
        />
        <Label>Image:</Label>
        <Input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          accept="image/*"
        />
        {currentImg && <ImageCircular src={currentImg} alt="Current Profile" />}
        {image && (
          <ImageCircular src={URL.createObjectURL(image)} alt="New Profile" />
        )}

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
          <Button onClick={updateUser}>Update</Button>
        )}
      </Wrapper>
      <Wrapper2>
        <H1Delete>Delete Your Account</H1Delete>
        <DeleteBtn onClick={() => DeleteAccount()}>Delete Account</DeleteBtn>
      </Wrapper2>
    </Container>
  );
};

export default Update;
