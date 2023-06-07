import { useState } from "react";
import TaskModal from "./TaskModal";

export default function Task(props) {
  const [displayModal, setDisplayModal] = useState(false);
  return (
    <div style={{ border: "1px solid white", width: "200px" }}>
      <div>{props.task.name}</div>
      <button onClick={() => setDisplayModal(true)}>Edit</button>
      {displayModal && <TaskModal task={props.task} setDisplayModal={setDisplayModal} callAPI={props.callAPI} />}
    </div>
  );
}
