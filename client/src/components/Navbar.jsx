import { IoPerson } from "react-icons/io5";
import styled from "styled-components";
import {  FaSearch, FaVideo } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {GiHamburgerMenu} from "react-icons/gi"
import Sidebar from "./Sidebar";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgSecond};
  height: 60px;
  z-index: 9999;

`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 18px;
  justify-content: space-between;
  position: relative;
  padding-right:2rem;
`;
const Search = styled.div`
  ${'' /* margin: auto; */}
  display: flex;
  width: 50%;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border: 1px solid #ccc;
  gap: 8px;
  border-radius: 25px;
  padding-left: 18px;
  padding-right:8px;
  @media(max-width:520px){
    padding-left: 8px;
  }
`;
const Input = styled.input`
  border: None;
  background-color: transparent;
  flex: 1;
  outline: none;
  @media(max-width:520px){
   font-size:10px 
  }
`;
const Button = styled.button`
  border: 1px solid #3ea6ff;
  padding: 5px 6px;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  gap: 6px;
  background-color: transparent;
  justify-content: space-around;
  display: flex;
  align-items: center;
`;
const UserComponent = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  height: 32px;
  width: 32px;
  object-fit: cover;
  border-radius: 50%;
  background-color: #999;
  cursor: pointer;
`;


const Navbar = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { user } = useSelector((state) => state.user);
  const [open,setOpen]=useState(false)
  const UserSearch=()=>{
    setInput("");
    navigate(`/search?q=${input}`)
  }
  return (
    <>
      <Container>
        <Wrapper>
        <GiHamburgerMenu onClick={()=>setOpen(!open)} className="block custom:hidden" size={22}/>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setInput(e.target.value)}
            />
            <FaSearch
              className="cursor-pointer"
              style={{ minWidth: '20px', minHeight: '20px' }}
              size={22}
              onClick={UserSearch}
            />
          </Search>
          {user ? (
            <UserComponent>
              <Link to={"/Create"}>
                <FaVideo size={22} style={{ cursor: "pointer" }} />
              </Link>
              <Link className="flex gap-4" to={"/Update"}>

              <Avatar src={user?.img} />
              <span className="font-semibold text-lg hidden custom:block cursor-pointer">
                {user?.name}
              </span>
              </Link>
            </UserComponent>
          ) : (
            <Link to={"/Login"}>
              <Button>
                <IoPerson size={22} />
                Sign In
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {
        open && <Sidebar open={open} setOpen={setOpen}/>
      }
    </>
  );
};

export default Navbar;
