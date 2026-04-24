import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [doubts, setDoubts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const fetchDoubts = () => {
    axios.get("http://localhost:3000/doubts")
      .then(res => setDoubts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const addDoubt = () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    axios.post("http://localhost:3000/doubt", {
      title,
      description
    }).then(() => {
      setTitle("");
      setDescription("");
      fetchDoubts();
    });
  };

  const acceptDoubt = (id) => {
    if (!name || !role) {
      alert("Enter name and select role");
      return;
    }

    const userIdentity = `${name} (${role})`;

    axios.post("http://localhost:3000/accept-doubt", {
      doubtId: id,
      userId: userIdentity
    }).then(() => {
      fetchDoubts();
    }).catch(() => {
      alert("Already accepted!");
    });
  };

  return (
    <div style={{ padding: 30, maxWidth: 850, margin: "auto" }}>

      <h1 style={{ textAlign: "center" }}>DoubtSphere 🚀</h1>

      {/* NAME */}
      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* ROLE */}
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="Guide">Guide</option>
        <option value="User">User</option>
      </select>

      {/* CREATE */}
      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={addDoubt}>Add</button>
      </div>

      {/* LIST */}
      {doubts.length === 0 ? (
        <p>No doubts yet</p>
      ) : (
        doubts.map((d) => (
          <div key={d._id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>

            <p>👤 {d.acceptedBy ? d.acceptedBy : "Not accepted yet"}</p>
            <h3>{d.title}</h3>
            <p>{d.description}</p>

            <p>Status: {d.status}</p>

            <button
              onClick={() => acceptDoubt(d._id)}
              disabled={d.status !== "OPEN"}
            >
              {d.status === "OPEN" ? "Accept" : "Already Accepted"}
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default App;