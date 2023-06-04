import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import Task from "./components/Task";
function App() {
  const [nameVal, setNameVal] = useState("");
  const [descVal, setDescVal] = useState("");

  const [mappedItems, setMappedItems] = useState({ current: 0, items: [] });
  useEffect(() => {
    callAPI();
  }, []);
  const callAPI = async () => {
    axios.get("http://localhost:4000/getAllTasks").then((data) => {
      let tempArr = [[]];
      data.data.forEach((task) => {
        if (tempArr[tempArr.length - 1].length === 10) {
          tempArr.push([<Task key={task.id} task={task} />]);
        } else {
          tempArr[tempArr.length - 1].push(<Task key={task.id} task={task} />);
        }
      });
      setMappedItems({ current: 0, items: tempArr });
    });
  };

  const addNewTask = async () => {
    axios.post("http://localhost:4000/newTask", { name: nameVal, description: { descVal: descVal } }).then(() => callAPI());
  };

  return (
    <div className="App">
      <header className="App-header">
        <input onChange={(e) => setNameVal(e.target.value)} placeholder="name" />
        <input onChange={(e) => setDescVal(e.target.value)} placeholder="description" />
        <button onClick={() => addNewTask()}>Add Task</button>
        {mappedItems.items[mappedItems.current]}
        {mappedItems.items.length > 1 && (
          <div style={{ display: "flex", margin: ".5rem" }}>
            <button
              onClick={() =>
                setMappedItems({
                  current: mappedItems.items[mappedItems.current + 1] !== undefined ? ++mappedItems.current : 0,
                  items: mappedItems.items,
                })
              }
            >
              Next
            </button>
            <button
              onClick={() =>
                setMappedItems({
                  current: mappedItems.items[mappedItems.current - 1] !== undefined ? --mappedItems.current : mappedItems.items.length - 1,
                  items: mappedItems.items,
                })
              }
            >
              Back
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
