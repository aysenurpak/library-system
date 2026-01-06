import { Navigate, Outlet, Link, useLocation } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";

const AnonymousLayout = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const location = useLocation();

  if (loggedInUser) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Library System
          </h1>
          <p className="text-gray-600">Manage your library efficiently</p>
        </div>

        <div className="flex justify-center mb-4 space-x-2">
          <Link
            to="/login"
            className={`px-6 py-2 rounded-t-lg font-medium ${
              location.pathname === "/login"
                ? "bg-white text-blue-600"
                : "bg-blue-100 text-gray-600 hover:bg-blue-200"
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`px-6 py-2 rounded-t-lg font-medium ${
              location.pathname === "/register"
                ? "bg-white text-blue-600"
                : "bg-blue-100 text-gray-600 hover:bg-blue-200"
            }`}
          >
            Register
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AnonymousLayout;
