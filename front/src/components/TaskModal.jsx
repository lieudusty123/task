import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function TaskModal(props) {
  const [mappedItems, setMappedItems] = useState([]);
  const [descInput, setDescInput] = useState("");
  async function removeDesc(descID) {
    // sending the description values we want to remove alongside the Bearer token to the server.
    // if everything goes well recall the new data
    axios
      .post(
        "http://localhost:4000/removeTaskDesc",
        { taskID: props.task._id, descID: descID },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      )
      .then(() => {
        props.callAPI();
        props.setDisplayModal(false);
      })
      .catch((err) => console.log(err));
  }
  async function addDesc() {
    // sending new description inputs alongside the Bearer token to the server.
    // if everything goes well recall the new data
    axios
      .post(
        "http://localhost:4000/addTaskDesc",
        { descInput, taskID: props.task._id },
        {
          headers: { Authorization: `Bearer ${Cookies.get("auth")}` },
        }
      )
      .then(() => {
        props.callAPI();
        props.setDisplayModal(false);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    //loops through the description array props and map them to elements
    let tempArr = props.task.description.map((desc) => (
      <div id={desc._id} key={desc.date}>
        {desc.descVal}
        <span onClick={() => removeDesc(desc._id)}>🗑️</span>
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
        padding: "1.5rem",
        width: "30vw",
        height: "30vh",
        overflow: "auto",
      }}
    >
      <button onClick={() => props.setDisplayModal(false)}>X</button>
      <input type="text" placeholder="addDesc" onChange={(e) => setDescInput(e.target.value)} />
      <button onClick={() => addDesc()}>+</button>
      <div>{props.task.descVal}</div>
      <div>{mappedItems}</div>
    </div>
  );
}
