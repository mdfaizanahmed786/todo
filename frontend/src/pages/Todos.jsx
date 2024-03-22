import { useState, useEffect, useCallback } from "react";
import { CreateTodos } from "../components/CreateTodos";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
function Todos() {
  const [modal, setModal] = useState(false);
  const [toEditedID, setEditedID] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [userName, setuserName] = useState("");
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetcher = useCallback(async (token) => {
    try {
      //  console.log(locationToken, isToken);
      const response = await fetch("http://localhost:5000/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        // Unauthorized, show alert and navigate to signin page
        alert("Unauthorized. Please sign in.");
        navigate("/signin");
        return;
      }
      const data = await response.json();
      setTodos(data);
      setuserName(data.userName);
    } catch (err) {
      console.log("Internal server error", err);
    }
  }, []);
  useEffect(() => {
    const locationToken = location.state?.token;
    const isToken = localStorage.getItem("token");
 
    if (isToken === null || isToken === "") {
      console.log("Token not found");
      setToken("");
      navigate("/signin");
      return;
    }

    setToken(isToken);
    fetcher(isToken);
    // Add/remove 'modal-open' class to body based on the modal state
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modal, location.state, navigate, fetcher]);
  const onDeleteHandler = (id) => {
    const deleteToken = localStorage.getItem("token");
    if (deleteToken === null || deleteToken === "") {
      alert("please sign in to continue");
      console.log("Token not found");
      navigate("/signin");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this todo?")) return;
    setModal(false);
    fetch(`http://localhost:5000/delete/${id}`, {
      method: "POST",
      body: JSON.stringify({
        id,
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async () => {
        fetcher(token);
      })
      .catch((err) => console.log(err));
  };
  const onSaveHandler = async () => {
    try {
      //console.log(editedTitle, editedDesc);
      const title = editedTitle;
      const description = editedDesc;
      if (
        title == "" ||
        description == "" ||
        title == null ||
        description == null 
      )
        return;

      setModal(false);
      fetch(`http://localhost:5000/update/${toEditedID}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          description,
          isEdited: true,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        if (res.ok) {
          fetcher(token);
          setEditedTitle("");
          setEditedDesc("");
        }
      });
    } catch (err) {
      console.log("Internal server error", err);
    }
  };
  const onEditHandler = (id, editoftitle, editofDesc) => {
    setEditedID(id);
    setEditedTitle(editoftitle);
    setEditedDesc(editofDesc);
    setModal(!modal);
  };

  return (
    <>
      <Navbar userName={userName} />
      <CreateTodos fetcher={fetcher} todos={todos} token={token} />
      {todos.todos?.length === 0 && (
        <h3 style={{ textAlign: "center" }}>
          No todos yet start adding them now!!
        </h3>
      )}
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        {modal && (
          <div
            style={darkBackgroundStyle}
            onClick={() => setModal(false)}
          ></div>
        )}
        {todos.todos?.map((todo) => (
          <div key={todo._id} style={todoItemStyle}>
            <h3 style={titleStyle}>{todo.title}</h3>
            <p style={descriptionStyle}>{todo.description}</p>
            <p style={dateStyle}>{new Date(todo.createdAt).toDateString()}</p>
            {todo.isEdited && <p style={editedStyle}>(Edited)</p>}

            <button
              style={deleteButtonStyle}
              onClick={() => onDeleteHandler(todo._id)}
            >
              Delete
            </button>
            <button
              style={editButtonStyle}
              onClick={() =>
                onEditHandler(todo._id, todo.title, todo.description)
              }
            >
              Edit
            </button>
          </div>
        ))}
        {modal && (
          <div style={modalStyles}>
            <form
              style={{ textAlign: "center" }}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <h2>Edit Todo</h2>
              <label htmlFor="editedTitle">Title:</label>
              <input
                type="text"
                id="editedTitle"
                value={editedTitle}
                selected
                style={inputStyle}
                placeholder="Title"
                onChange={(e) => setEditedTitle(e.target.value)}
                required
              />

              <label htmlFor="editedDescription">Description:</label>
              <textarea
                id="editedDescription"
                style={inputStyle}
                value={editedDesc}
                placeholder="Description"
                selected
                onChange={(e) => setEditedDesc(e.target.value)}
                required
              />

              <button style={saveStyle} onClick={() => onSaveHandler()}>
                Save
              </button>
              <button style={closeStyle} onClick={() => setModal(!modal)}>
                Close
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
export default Todos;
// Inline styles
const darkBackgroundStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
  zIndex: 1, // Ensure it's above other elements
};

const editedStyle = {
  position: "absolute",
  marginTop: "-2vh",
  marginLeft: "5vw",
  fontSize: "2vh",
  color: "#888",
  fontStyle: "italic",
};

const closeStyle = {
  backgroundColor: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "1vh 2vw",
  borderRadius: "3px",
  cursor: "pointer",
  marginLeft: "5vw",
  width: "30%",
};

const saveStyle = {
  backgroundColor: "#4caf50",
  color: "#fff",
  border: "none",
  padding: "1vh 2vw",
  borderRadius: "3px",
  cursor: "pointer",
  margin: "2vh",
  width: "30%",
};

const modalStyles = {
  backdropFilter: "blur(5px)",
  display: "flex",
  width: "80%", // Adjust width for responsiveness
  maxWidth: "400px", // Maximum width for larger screens
  flexDirection: "column",
  alignItems: "center",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "2vh",
  borderRadius: "5px",
  boxShadow: "0 0 2vh rgba(0, 0, 0, 0.1)",
  zIndex: 2,
};


const inputStyle = {
  marginBottom: "2vh",
  padding: "1vh",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};

const todoItemStyle = {
  border: "1px solid #ddd",
  padding: "1vh",
  marginBottom: "2vh",
  borderRadius: "5px",
};

const titleStyle = {
  fontSize: "3vh",
  fontWeight: "bold",
  margin: "0",
};

const descriptionStyle = {
  fontSize: "2vh",
  margin: "1vh 0",
};

const dateStyle = {
  fontSize: "1.5vh",
  color: "#888",
};

const deleteButtonStyle = {
  backgroundColor: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "1vh 1vw", // Adjust padding for responsiveness
  borderRadius: "3px",
  cursor: "pointer",
  marginRight: "1vw", // Add margin to separate the buttons
  width: "48%", // Set width to 48% for equal widths, considering margin
};

const editButtonStyle = {
  backgroundColor: "#4caf50",
  color: "#fff",
  border: "none",
  padding: "1vh 1vw", // Adjust padding for responsiveness
  borderRadius: "3px",
  cursor: "pointer",
  width: "48%", // Set width to 48% for equal widths, considering margin
};

