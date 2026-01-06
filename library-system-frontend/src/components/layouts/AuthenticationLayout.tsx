import { Navigate, Outlet } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";
import { Button } from "flowbite-react";
import Cookies from "universal-cookie";

const AuthenticationLayout = () => {
  const { loggedInUser, setLoggedInUser } = useLoggedInUsersContext();

  if (!loggedInUser) return <Navigate to="/login" />;

  function handleLogout() {
    const cookies = new Cookies();
    cookies.remove("loggedInUser");
    setLoggedInUser(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            Library Management System
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {loggedInUser.username}!
            </span>
            <Button size="sm" color="red" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default AuthenticationLayout;
