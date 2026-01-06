import { useNavigate } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";
import { Button, Card } from "flowbite-react";
import { FaBook, FaUser, FaTags, FaExchangeAlt } from "react-icons/fa";

const Homepage = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useLoggedInUsersContext();

  const menuItems = [
    {
      title: "Books",
      description: "Manage library books",
      icon: <FaBook className="text-4xl text-blue-500" />,
      path: "/admin/books",
      roles: ["admin", "librarian", "member"],
    },
    {
      title: "Authors",
      description: "Manage authors",
      icon: <FaUser className="text-4xl text-green-500" />,
      path: "/admin/authors",
      roles: ["admin", "librarian"],
    },
    {
      title: "Categories",
      description: "Manage book categories",
      icon: <FaTags className="text-4xl text-purple-500" />,
      path: "/admin/categories",
      roles: ["admin", "librarian"],
    },
    {
      title: "Borrows",
      description: "Manage book borrowing",
      icon: <FaExchangeAlt className="text-4xl text-orange-500" />,
      path: "/admin/borrows",
      roles: ["admin", "librarian"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(loggedInUser?.role || "")
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to Library System
        </h1>
        <p className="text-gray-600">
          Logged in as:{" "}
          <span className="font-semibold">{loggedInUser?.username}</span> (
          <span className="capitalize">{loggedInUser?.role}</span>)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMenu.map((item) => (
          <Card
            key={item.path}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {item.icon}
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <Button size="sm" color="blue">
                Go to {item.title}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
