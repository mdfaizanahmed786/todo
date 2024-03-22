import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";

function Verify() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/verify/${token}`);
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          setVerificationStatus("verified");
          navigate("/todos", { state: { token: data.token } });
        } else {
          // Check if the verification status is expired
          if (data.error === "TokenExpiredError") {
            setVerificationStatus("expired");
          } else {
            setVerificationStatus("error");
          }
        }
      } catch (error) {
        console.error("Error fetching new token:", error);
        setVerificationStatus("error");
      }
    };

    verifyToken();
  }, [token, navigate]);

  if (verificationStatus === "verified") {
    return <div>Verified</div>;
  } else if (verificationStatus === "expired") {
    return (
      <div>
        <p>Verification link has expired. Please sign up again.</p>
        <p>
          If you don't have an account, you can{" "}
          <Link to="/signup">sign up here</Link>.
        </p>
      </div>
    );
  } else {
    return <div>Error verifying email. Please try again or sign up,  <Link to="/signup">sign up here</Link>.</div>;
  }
}

export default Verify;
