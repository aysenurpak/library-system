import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { api } from "../../helper/api";
import Cookies from "universal-cookie";
import { useLoggedInUsersContext } from "./LoggedInUserContext";
import { toast } from "sonner";

const Login = () => {
  const cookies = new Cookies();
  const { setLoggedInUser } = useLoggedInUsersContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    api
      .request({
        url: "auth/login",
        method: "post",
        data: { username, password },
      })
      .then((res) => {
        cookies.set("loggedInUser", JSON.stringify(res.data), {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });
        setLoggedInUser(res.data);
        toast.success("Login successful!");
      })
      .catch(() => {
        toast.error("Login failed! Check your credentials.");
      });
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-center mb-6">Login</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <TextInput
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <TextInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
