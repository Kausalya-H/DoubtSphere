import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [doubts, setDoubts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 👉 load doubts
  useEffect(() => {
    axios.get("http://localhost:3000/doubts")
      .then(res => setDoubts(res.data));
  }, []);

  // 👉 create doubt
  const addDoubt = () => {
    axios.post("http://localhost:3000/doubt", {
      title,
      description
    }).then(res => {
      setDoubts([...doubts, res.data]);
      setTitle("");
      setDescription("");
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>DoubtSphere 🚀</h1>

      {/* FORM */}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br /><br />

      <button onClick={addDoubt}>Add Doubt</button>

      <hr />

      {/* LIST */}
      {doubts.length === 0 ? (
        <p>No doubts yet</p>
      ) : (
        doubts.map(d => (
          <div key={d.id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
            <h3>{d.title}</h3>
            <p>{d.description}</p>
            <p>Status: {d.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;