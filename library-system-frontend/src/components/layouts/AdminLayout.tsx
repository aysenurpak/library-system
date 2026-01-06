import { Navigate, Outlet, Link, useLocation } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";

const AdminLayout = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const location = useLocation();

  // Giriş yapmamışsa login'e yönlendir
  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  // Role göre menü öğeleri
  const navItems = [
    {
      path: "/admin/books",
      label: "Books",
      roles: ["admin", "librarian", "member"],
    },
    { path: "/admin/authors", label: "Authors", roles: ["admin", "librarian"] },
    {
      path: "/admin/categories",
      label: "Categories",
      roles: ["admin", "librarian"],
    },
    { path: "/admin/borrows", label: "Borrows", roles: ["admin", "librarian"] },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(loggedInUser?.role || "")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Library System
              </Link>
              <div className="hidden md:flex space-x-4">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {loggedInUser?.username} ({loggedInUser?.role})
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
