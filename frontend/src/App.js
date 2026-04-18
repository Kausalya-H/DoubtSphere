import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [doubts, setDoubts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 👉 Fetch doubts
  const fetchDoubts = () => {
    axios.get("http://localhost:3000/doubts")
      .then(res => setDoubts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  // 👉 Add doubt
  const addDoubt = () => {
    if (!title || !description) return;

    axios.post("http://localhost:3000/doubt", {
      title,
      description
    }).then(() => {
      setTitle("");
      setDescription("");
      fetchDoubts();
    });
  };

  // 👉 Accept doubt
  const acceptDoubt = (id) => {
    axios.post("http://localhost:3000/accept-doubt", {
      doubtId: id,
      userId: "kausalya"
    }).then(() => {
      fetchDoubts();
    });
  };

  return (
    <div style={{
  padding: 30,
  fontFamily: "Inter, sans-serif",
  maxWidth: 850,
  margin: "0 auto",
  minHeight: "100vh",
  backgroundColor: "#f4f6f8",
  color: "#111"
}}>

      {/* HEADER */}
      <h1 style={{
  textAlign: "center",
  marginBottom: 25,
  fontSize: 30
}}>
  DoubtSphere 🚀
</h1>

      {/* CREATE BOX */}
      {/* CREATE BOX */}
{/* CREATE BOX */}
<div style={{
  background: "white",
  padding: 15,
  borderRadius: 12,
  display: "flex",
  gap: 10,
  marginBottom: 20,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
}}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd"
          }}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            flex: 2,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd"
          }}
        />

        <button
          onClick={addDoubt}
          style={{
  padding: "10px 15px",
  borderRadius: 8,
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  cursor: "pointer",
  transition: "0.2s"
}}
        >
          Add
        </button>
      </div>

      {/* LIST */}
      {doubts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No doubts yet</p>
      ) : (
        doubts.map((d) => (
          <div
            key={d._id}
            style={{
  background: "white",
  padding: 18,
  marginBottom: 15,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
}}
          >
            <h3>{d.title}</h3>
            <p>{d.description}</p>

            {/* STATUS BADGE */}
            <p>
              Status:{" "}
              <span style={{
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  color: "white",
  backgroundColor: d.status === "OPEN" ? "#3b82f6" : "#10b981"
}}>
                {d.status}
              </span>
            </p>

            {/* ACCEPTED BY */}
            {d.acceptedBy && (
              <p style={{ color: "#10b981", fontWeight: "bold" }}>
                Accepted by: {d.acceptedBy}
              </p>
            )}

            {/* BUTTON */}
            {d.status === "OPEN" ? (
              <button
  onClick={() => acceptDoubt(d._id)}
  disabled={d.status !== "OPEN"}
  style={{
    marginTop: 10,
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#111827",
    color: "white",
    cursor: d.status === "OPEN" ? "pointer" : "not-allowed",
    opacity: d.status === "OPEN" ? 1 : 0.5
  }}
>
  Accept
</button>
            ) : (
              <button
                disabled
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "#d1d5db",
                  color: "#666"
                }}
              >
                Already Accepted
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;