import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import Task from "./components/Task";
import Cookies from "js-cookie";
import AddTask from "./components/AddTask";
import Login from "./components/Login";
function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [mappedItems, setMappedItems] = useState({ current: 0, items: [] });

  useEffect(() => {
    // If user have "auth" cookies the server will be called, else show login form
    Cookies.get("auth") ? callAPI() : setIsLogin(false);
  }, [isLogin]);
  const callAPI = async () => {
    // fetch all tasks and creates JSX elements from them
    // If the token is wrong / invalid cookies will be cleared and will show login form
    axios
      .get("http://localhost:4000/getAllTasks", { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } })
      .then((res) => {
        let tempArr = [[]];
        if (res.data.length > 0) {
          res.data.forEach((task) => {
            if (tempArr[tempArr.length - 1].length === 10) {
              tempArr.push([<Task key={task._id} task={task} />]);
            } else {
              tempArr[tempArr.length - 1].push(<Task key={task._id} task={task} callAPI={callAPI} />);
            }
          });
          setMappedItems({ current: 0, items: tempArr });
        }
      })
      .catch((err) => {
        if (err.response.data === "token invalid") {
          setIsLogin(false);
          Cookies.remove("auth");
        } else {
          console.log(err);
        }
      });
  };

  return (
    <div className="App">
      <div className="App-body">
        {/* conditional rendering for components */}
        {!isLogin && <Login setIsLogin={setIsLogin} />}
        {isLogin && <AddTask callAPI={callAPI} />}
        {isLogin && (
          <>
            {mappedItems.items[mappedItems.current]}
            {mappedItems.items.length > 1 && (
              <div style={{ display: "flex", margin: ".5rem" }}>
                <button
                  onClick={() =>
                    // checks if previous index is not undefined, if it is the index will be lowered by 1
                    // else it will be set as the array length-1
                    setMappedItems({
                      current:
                        mappedItems.items[mappedItems.current - 1] !== undefined ? --mappedItems.current : mappedItems.items.length - 1,
                      items: mappedItems.items,
                    })
                  }
                >
                  Back
                </button>
                <button
                  onClick={() =>
                    // checks if next index is not undefined, if it is the index will be increased by 1
                    // else it will be set as the array length-1
                    setMappedItems({
                      current: mappedItems.items[mappedItems.current + 1] !== undefined ? ++mappedItems.current : 0,
                      items: mappedItems.items,
                    })
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
