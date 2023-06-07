import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

export default function AddTask(props) {
  const [nameVal, setNameVal] = useState("");
  const [descVal, setDescVal] = useState("");

  const addNewTask = async () => {
    // call the server with details about the new task and the token
    axios
      .post(
        "http://localhost:4000/newTask",
        { name: nameVal, description: { descVal: descVal } },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      )
      .then(() => props.callAPI());
  };

  return (
    <div>
      <h3>Add New Task</h3>

      <input onChange={(e) => setNameVal(e.target.value)} placeholder="name" />
      <input onChange={(e) => setDescVal(e.target.value)} placeholder="description" />
      <button onClick={() => addNewTask()}>Add Task</button>
    </div>
  );
}
