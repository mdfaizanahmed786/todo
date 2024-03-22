import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function CreateTodos({ todos, fetcher }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const alertShownRef = useRef(false);

  useEffect(() => {
    if (token === null || token === "") {
      if (!alertShownRef.current) {
        console.log("Token not found");
        alert("Please sign in to continue");
        navigate("/signin");
        alertShownRef.current = true;
      }
    }
  }, [navigate, token]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "100%",
        margin: "auto",
        padding: "0 10px", // Added padding for better spacing
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        style={{ width: "100%" }}
      >
        <input
          type="text"
          placeholder="Title"
          style={{
            marginBottom: "10px",
            width: "100%", // Make input field 100% width
            height: "30px",
            borderRadius: "5px",
            outline: "none",
            padding: "5px",
          }}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />

        <input
          type="text"
          placeholder="Description"
          style={{
            marginBottom: "10px",
            width: "100%", // Make input field 100% width
            height: "30px",
            borderRadius: "5px",
            outline: "none",
            padding: "5px",
          }}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
        />

        <button
          style={{
            width: "100%", // Make button 100% width
            height: "40px",
            marginBottom: "20px",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            outline: "none",
          }}
          onClick={() => {
            if (title.length === 0 || description.length === 0) return;
            fetch("http://localhost:5000/todo", {
              method: "POST",
              body: JSON.stringify({
                title,
                description,
                isEdited: false,
              }),
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
              .then(async (res) => {
                const data = await res.json();
                if (data.success) {
                  fetcher(token);
                  setTitle("");
                  setDescription("");
                }
              })
              .catch((err) => console.log(err));
          }}
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}
