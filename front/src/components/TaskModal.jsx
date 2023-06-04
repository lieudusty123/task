import axios from "axios";
import { useEffect, useState } from "react";

export default function TaskModal(props) {
  const [mappedItems, setMappedItems] = useState([]);
  const [descInput, setDescInput] = useState("");
  async function removeDesc(date) {
    console.log(props.task.id);
    axios.delete("http://localhost:4000/removeTaskDesc", { date: date, taskID: props.task.id });
    let filtered = [...props.task.description].filter((desc) => desc.date !== date);

    let newMapped = filtered.map((desc) => (
      <div id={desc.date} key={desc.date}>
        {desc.descVal}
        <span onClick={(e) => removeDesc(desc.date)}>🗑️</span>
      </div>
    ));
    setMappedItems(newMapped);
  }
  async function addDesc() {
    axios.post("http://localhost:4000/addTaskDesc", { descInput, taskID: props.task.id });
  }
  useEffect(() => {
    let tempArr = props.task.description.map((desc) => (
      <div id={desc.date} key={desc.date}>
        {desc.descVal}
        <span onClick={(e) => removeDesc(desc.date)}>🗑️</span>
      </div>
    ));
    setMappedItems(tempArr);
  }, []);
  return (
    <div
      style={{
        backgroundColor: "grey",
        zIndex: "2",
        position: "absolute",
        top: "35%",
        left: "35%",
        margin: "auto",
        width: "30vw",
        height: "30vh",
      }}
    >
      <button onClick={() => props.setDisplayModal(false)}>X</button>
      <input type="text" placeholder="addDesc" onChange={(e) => setDescInput(e.target.value)} />
      <button onClick={() => addDesc()}>+</button>
      <div>{props.task.descVal}</div>
      {mappedItems}
    </div>
  );
}
