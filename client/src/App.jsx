import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/theme";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Video from "./Pages/Video";
import Search from "./Pages/Search";
import ChannelPage from "./Pages/ChannelPage";
import CreateVideo from "./Pages/CreateVideo";
import Update from "./Pages/Update";
import UpdateVideo from "./Pages/UpdateVideo";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
const Container = styled.div`
  display: flex;
  background-color: #dadada;
  width: 100vw;
  min-height: 100vh;
  z-index: 200;
`;
const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;
const Wrapper = styled.div`
  padding: 22px 78px;
  @media (max-width: 1720px) {
    padding: 22px 56px;
  }

  @media (max-width: 1420px) {
    padding: 22px 16px;
  }
`;

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const { user } = useSelector((state) => state.user);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu mode={darkMode} changeMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route index element={<Home type="random" />} />
                <Route path="/trend" element={<Home type="trend" />} />
                <Route path="/sub" element={<Home type="sub" />} />
                {!user && <Route path="login" element={<Login />} />}
                {!user && <Route path="register" element={<Register />} />}
                <Route path="/Search" element={<Search />} />
                {user && (
                  <Route path="/History" element={<Home type={"History"} />} />
                )}
                {user && (
                  <Route path="/Liked" element={<Home type={"Liked"} />} />
                )}
                {user && <Route path="/Create" element={<CreateVideo />} />}
                {user && <Route path="/Update" element={<Update />} />}
                {user && (
                  <Route path="/UpdateVideo/:id" element={<UpdateVideo />} />
                )}
                <Route path="video">
                  <Route path=":id" element={<Video />} />
                </Route>
                {user && (
                  <Route path="Channel">
                    <Route path=":channelId" element={<ChannelPage />} />
                  </Route>
                )}
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
