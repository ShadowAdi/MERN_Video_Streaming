/* eslint-disable react/prop-types */
import styled from "styled-components";
import { FaHome, FaThumbsUp } from "react-icons/fa";
import {
  MdExplore,
  MdOutlineSubscriptions,
  MdSettings,
  MdLightMode,
} from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/UserSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { GrChannel } from "react-icons/gr";

const Container = styled.div`
  flex: 1.5;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bgSecond};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  overflow-y: auto;
  position: sticky;
  top: 0;
  left: 0;
  max-height: 100vh;
  @media (max-width: 832px) {
    display: none;
    flex: 0;
  }
`;
const Wrapper = styled.div`
  padding: 18px 22px;
  @media (max-width: 1440px) {
    padding: 22px 16px;
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  padding: 5px 10px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
  @media (max-width: 1720px) {
    font-size: 14px;
  }
`;

const Image = styled.img`
  height: 30px;
  width: 30px;
  object-fit: cover;
  cursor: pointer;
  @media (max-width: 1720px) {
    height: 24px;
    width: 24px;
  }
`;
const H2 = styled.h2`
  font-weight: semibold;
  margin-top: 16px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const P = styled.p`
  font-weight: semibold;
  margin-top: 16px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.textSoft};
`;
const Items = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  padding: 0px 0px 16px 0px;
  margin-top: 10px;
`;

const Login = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Button = styled.button`
  border: 1px solid #3ea6ff;
  padding: 5px 6px;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 900;
  cursor: pointer;
  gap: 6px;
  background-color: transparent;
  justify-content: space-around;
  display: flex;
  align-items: center;
  width: "100%";
`;
const Hr = styled.hr`
  margin-top: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
`;

const LogoutButton = styled.button`
  padding: 12px 10px;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  gap: 6px;
  background-color: #3ea6ff;
  margin: auto auto;
`;

const Menu = ({ changeMode, mode }) => {
  const { user } = useSelector((state) => state.user);
  const [SubscribedChannels, setSubscribedChannels] = useState([]);

  const dispatch = useDispatch();

  const LogoutBtn = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/Auth/logout",
        {},
        { withCredentials: true }
      );
      dispatch(logout());
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const SubscribedUsers = async () => {
      if (user) {
        try {
          await axios
            .get("http://localhost:8080/api/users/subscribed/users", {
              withCredentials: true,
            })
            .then((res) => setSubscribedChannels(res?.data))
            .catch((err) => console.log(err));
        } catch (error) {
          console.error("Error during logout:", error);
        }
      }
      else{
        return
      }
    };
    SubscribedUsers();
  }, [user]);

  return (
    <Container>
      <Wrapper>
        <Link to={"/"}>
          <Logo>
            <Image src="https://i.pinimg.com/736x/a5/0e/ab/a50eabc89771c091caab941d7ee9266e.jpg" />
            <h1>VideoTube</h1>
          </Logo>
        </Link>
        <Items>
          <Link style={{ width: "100%" }} to={"/"}>
            <Item>
              <FaHome size={22} />
              <p className="hidden custom:block">Home</p>
            </Item>
          </Link>
          <Link style={{ width: "100%" }} to={"/trend"}>
            <Item>
              <MdExplore size={22} />
              Explore
            </Item>
          </Link>
          {user && (
            <Link style={{ width: "100%" }} to={"/sub"}>
              <Item>
                <MdOutlineSubscriptions size={22} />
                Subscriptions
              </Item>
            </Link>
          )}
        </Items>
        <Items>
          {user && (
            <Link to={"/Liked"} style={{ width: "100%" }}>
              <Item>
                <FaThumbsUp size={22} />
                Liked Videos
              </Item>
            </Link>
          )}
          {user && (
            <Link to={"/History"} style={{ width: "100%" }}>
              <Item>
                <MdOutlineSubscriptions size={22} />
                History
              </Item>
            </Link>
          )}
          {user && (
            <Link to={`/Channel/${user?._id}`} style={{ width: "100%" }}>
              <Item>
                <GrChannel size={22} />
                Your Channel
              </Item>
            </Link>
          )}
        </Items>
        {!user && (
          <>
            <Login>
              <P className="text-sm mt-4 mb-3 capitalize text-stone-200">
                Sign in to like Videos,Comments and Share.
              </P>
              <Link to={"/Login"} style={{ width: "100%" }}>
                <Button>
                  <IoPerson size={22} />
                  Sign In
                </Button>
              </Link>
            </Login>
            <Hr />
          </>
        )}
        <H2 className="font-semibold mt-4 mb-3 text-stone-300 uppercase">
          Subscribed Channels
        </H2>

        {user && (
          <Items>
            {SubscribedChannels.length > 0 ? (
              SubscribedChannels?.map((channel, i) => {
                return (
                  <>
                    <Link
                      key={i}
                      to={`/Channel/${channel?._id}`}
                      className="w-full"
                    >
                      <Item>
                        <img
                          className="h-8 w-8 object-cover rounded-full"
                          src={channel?.img}
                        />
                        {channel?.name}
                      </Item>
                    </Link>
                  </>
                );
              })
            ) : (
              <h1>None</h1>
            )}
          </Items>
        )}

        <Items>
          <Item>
            <MdSettings size={22} />
            Settings
          </Item>

          <Item onClick={() => changeMode(!mode)}>
            <MdLightMode size={22} />
            {mode ? "Light Mode" : "Dark Mode"}
          </Item>
        </Items>

        {user && (
          <Items>
            <LogoutButton onClick={LogoutBtn}>Logout</LogoutButton>
          </Items>
        )}
      </Wrapper>
    </Container>
  );
};

export default Menu;
