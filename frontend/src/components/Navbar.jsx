import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const NavBar = ({userName}) => {
    const navigate=useNavigate()
    const logoutHandler = () => {
        localStorage.removeItem("token")
        navigate("/signin")
    }
  return (
    <nav style={navStyle}>
      <ul style={navListStyle}>
        <li style={navItemStyle}>
          <Link to="/todos" style={navLinkStyle}>
            Todos
          </Link>
        </li>
        <li style={{marginLeft:"auto", color:"white", marginTop:"3px", fontSize: "17px",
        fontWeight: "bold",}}>Welcome, {userName}</li>
        <li style={{ marginLeft: "auto", textAlign: "end" }}>
          <button style={logoutButtonStyle} onClick={()=>logoutHandler()}>Log out</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

// Inline styles for the navigation bar
const navStyle = {
  background: "#333",
  padding: "10px 0",
  marginLeft:"-8px",
  marginRight:"-8px",
  paddingTop: "15px", // Removed padding from top
  marginTop: "-8px", // Removed margin from top
  marginBottom:"10px", // Removed margin from top, left, and right
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
};

const navListStyle = {
  listStyle: "none",
  display: "flex",
  justifyContent: "left",
  margin: 0,
  padding: 0,
};

const navItemStyle = {
  marginRight: "15px",
};

const navLinkStyle = {
  textDecoration: "none",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  padding: "8px",
  borderRadius: "5px",
  transition: "background 0.3s",
};

const logoutButtonStyle = {
  backgroundColor: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  marginRight:"5px",
  borderRadius: "5px",
  cursor: "pointer",
};
