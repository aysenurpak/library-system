import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import { createBrowserRouter, RouterProvider } from "react-router";
import LoggedInUserContextProvider from "./components/auth/LoggedInUserContext.tsx";
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";
import AnonymousLayout from "./components/layouts/AnonymousLayout.tsx";
import AuthenticationLayout from "./components/layouts/AuthenticationLayout.tsx";
import Homepage from "./components/homepage/Homepage.tsx";
import AdminLayout from "./components/layouts/AdminLayout.tsx";
import BookList from "./components/books/BookList.tsx";
import AuthorList from "./components/authors/AuthorList.tsx";
import CategoryList from "./components/categories/CategoryList.tsx";
import BorrowList from "./components/borrows/BorrowList.tsx";

const router = createBrowserRouter([
  {
    Component: AnonymousLayout,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    Component: AuthenticationLayout,
    children: [
      {
        path: "/",
        Component: Homepage,
      },
      {
        path: "/admin",
        Component: AdminLayout,
        children: [
          {
            path: "/admin/books",
            Component: BookList,
          },
          {
            path: "/admin/authors",
            Component: AuthorList,
          },
          {
            path: "/admin/categories",
            Component: CategoryList,
          },
          {
            path: "/admin/borrows",
            Component: BorrowList,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoggedInUserContextProvider>
      <div className="bg-gray-50 min-h-screen">
        <Toaster richColors position="top-center" />
        <RouterProvider router={router} />
      </div>
    </LoggedInUserContextProvider>
  </StrictMode>
);
