import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowconfirmPass] = useState(false);
  const navigate = useNavigate();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = async () => {
    if (username === "" || email === "" || password === "" || confirmPass === "")
      return alert("Please fill all the fields");
    if (password !== confirmPass) return alert("Please confirm your password");
    if (!validateEmail()) {
      alert("Invalid email");
      return;
    }
    if (password.length < 8) return alert("Password must be at least 8 characters long");

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const receivedToken = data.token;
        localStorage.setItem("token", receivedToken);
        alert("Check your email for verification");
        setUsername("");
        setEmail("");
        setPassword("");
        setconfirmPass("");
      } else {
        console.log("Sign-up failed");
        alert("Sign-up failed");
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      alert("Sign-up failed");
    }
  };

  return (
    <>
      <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="username"><b>Username: </b></label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          />

          <label htmlFor="email"><b>Email: </b></label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          />

          <label htmlFor="password"><b>Password: </b></label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Create a Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ marginLeft: "-30px", padding: "8px", backgroundColor: "transparent", border: "none", cursor: "pointer" }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <label htmlFor="confirmPassword"><b>Confirm Password: </b></label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showConfirmPass ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              onChange={(e) => setconfirmPass(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box", }}
            />
            <button
              type="button"
              onClick={() => setShowconfirmPass(!showConfirmPass)}
              style={{ marginLeft: "-30px", padding: "8px", backgroundColor: "transparent", border: "none", cursor: "pointer" }}
            >
              {showConfirmPass ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <br />
          <button
            type="button"
            onClick={() => submitHandler()}
            style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%" }}
          >
            Submit
          </button>
        </form>
      </div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>Have an Account? Go to <Link to="/signin">Signin</Link></div>
    </>
  );
}
