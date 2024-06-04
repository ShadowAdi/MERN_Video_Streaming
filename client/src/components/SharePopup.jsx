import styled from "styled-components";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useLocation } from "react-router-dom";
const Container = styled.div`
  width: 300px;
  height: 150px;
  position: absolute;
  top: 70%;
  left: 50%;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.bgSecond};
  color: ${({ theme }) => theme.text};
  padding: 20px;
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
  font-size: 24px;
  font-weight: 800;
  text-align: center;
`;
const WrapperDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-evenly;

`;

const SharePopup = ({ setOpen }) => {
  const path = useLocation();
  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Share  the Video</Title>
        <WrapperDiv>
          <LinkedinShareButton url={path?.pathname}>
            <LinkedinIcon size={32} round={true} />
          </LinkedinShareButton>
          <FacebookShareButton url={path?.pathname}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <TwitterShareButton url={path?.pathname}>
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
          <WhatsappShareButton url={path?.pathname}>
            <WhatsappIcon size={32} round={true} />
          </WhatsappShareButton>
          <TelegramShareButton url={path?.pathname}>
            <TelegramIcon size={32} round={true} />
          </TelegramShareButton>
        </WrapperDiv>
      </Wrapper>
    </Container>
  );
};

export default SharePopup;
