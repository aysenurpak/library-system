import {
  Button,
  Label,
  Modal,
  ModalBody,
  TextInput,
  Select,
} from "flowbite-react";
import { useState } from "react";
import { api } from "../../helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  function handleRegister() {
    api
      .request({
        url: "auth/register",
        method: "post",
        data: { username, password, role, fullName, email },
      })
      .then(() => {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Registration failed!");
        console.error(error);
      });
  }

  return (
    <Modal show={true} size="md" popup>
      <h3 className="px-4 py-4 text-xl font-bold">Register</h3>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username">Username</Label>
            </div>
            <TextInput
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password">Password</Label>
            </div>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="fullName">Full Name</Label>
            </div>
            <TextInput
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Email</Label>
            </div>
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="role">Role</Label>
            </div>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <div className="w-full flex gap-2">
            <Button onClick={handleRegister}>Register</Button>
            <Button color="gray" onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Register;
