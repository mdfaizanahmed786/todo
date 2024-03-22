import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    try {
      if(email === "" || password === "") return alert("Please fill all the fields")
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    //  console.log(response, "This is f** response...")

      if (response.ok) {
        const data = await response.json();
        const receivedToken = data.token;
      
        localStorage.setItem("token", `${data.token}`);
        navigate("/todos", { state: { token: receivedToken } });
        setEmail("");
        setPassword("");
      } else {
        console.log("Sign-in failed:", response.status);
        alert("Sign-in failed or you have not verified your email");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
     
        <label htmlFor="email">
          <b>Email: </b>
        </label>
        <input   
          type="email"
          id="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
        />
        <br />
        <label htmlFor="password">
          <b>Password: </b>
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ marginLeft: '-30px', padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <br />
        <button type="button" onClick={() => submitHandler()} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Submit
        </button>
        </div>
        <div style={{textAlign:"center", marginTop:"10px"}}>New to our app? go to <Link to="/signup">Signup</Link></div>
  </form>
  );
}
