import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Login({ setIsLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm(e) {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      // after calling server, if data is correct a token will be received and saved in cookies
      axios
        .post("http://localhost:4000/login", { username: username, password: password })
        .then((res) => {
          Cookies.set("auth", res.data);
          console.log(res.data);
          setIsLogin(true);
        })
        .catch((err) => alert(err.response.data));
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={validateForm}>
        <input type="text" placeholder="username..." onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="password..." onChange={(e) => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
    </div>
  );
}
