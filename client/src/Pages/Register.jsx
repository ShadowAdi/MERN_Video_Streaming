import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/UserSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/Firebase";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  color: ${({ theme }) => theme.text};
  flex-direction: column;
  height: 91.1vh;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 10px;
  width: 100%;
  @media (max-width: 720px) {
    gap: 5px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  @media (max-height: 720px) {
    font-size: 16px;
  }
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
  @media (max-height: 720px) {
    font-size: 14px;
  }
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
  @media (max-height: 720px) {
    padding: 4px 10px;
  }
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  transition: all ease-in 0.3s;
  &:hover {
    background-color: #ff0000;
    color: ${({ theme }) => theme.text};
    border-radius: 21px;
  }

  @media (max-height: 720px) {
    padding: 4px 10px;
    font-size: 14px;
  }
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Conts = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgSecond};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 20px;
  text-align: center;
  width: 45%;
  @media (max-width: 720px) {
    gap: 10px;
    padding: 6px 10px;
    width: 90%;
  }
`;

const Button1 = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: #4c8bf5;
  color: #fff;
  transition: all ease-in 0.3s;
  display: flex;
  align-items: start;
  gap: 0.8rem;
  justify-content: center;
  &:hover {
    background-color: #ff0000;
    color: ${({ theme }) => theme.text};
    border-radius: 21px;
  }
  @media (max-height: 720px) {
    padding: 4px 10px;
    font-size: 14px;
  }
`;

const P = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  @media (max-height: 540px) {
    font-size: 0.8rem;
  }
`;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("http://localhost:8080/api/Auth/Google", {
            name: result?.user?.displayName,
            email: result?.user?.email,
            img: result?.user?.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
            toast("User Created");
            navigate("/");
          })
          .catch(() => {
            dispatch(loginFailure());
          });
      })
      .catch(() => {
        dispatch(loginFailure());
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/Auth/Signup", {
        name: name,
        password,
        email,
      });
      navigate("/Login");
      toast("User Created");
    } catch (error) {
      toast("User Can't created");
    }
  };
  return (
    <Container>
      <Wrapper>
        {" "}
        <Conts>
          <Title>Register</Title>
          <SubTitle>to continue to Video Tube</SubTitle>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="username"
          />
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
          />
          <Button onClick={handleRegister}>Register</Button>
          <Title>or</Title>
          <Button1 onClick={SignInWithGoogle}>
            <FaGoogle /> Register With Google
          </Button1>
        </Conts>
      </Wrapper>
      <More>
        <P>
          Already Have An Account?{" "}
          <Link className="text-[#FF0000] underline" to={"/Login"}>
            Login
          </Link>{" "}
        </P>
      </More>
    </Container>
  );
};

export default Register;
