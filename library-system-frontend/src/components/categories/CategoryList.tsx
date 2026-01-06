import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
  Button,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { api } from "../../helper/api";
import type { Category } from "../../types/Category";
import { CategoryFormModal } from "./CategoryFormModal";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext"; 

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { loggedInUser } = useLoggedInUsersContext(); 

  function fetchCategories() {
    api.get("categories").then((res) => setCategories(res.data));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this category?")) {
      api
        .delete(`categories/${id}`)
        .then(() => {
          toast.success("Category deleted successfully");
          fetchCategories();
        })
        .catch(() => toast.error("Failed to delete category"));
    }
  }

  const canEdit =
    loggedInUser?.role === "admin" || loggedInUser?.role === "librarian";
  const canDelete = loggedInUser?.role === "admin"; 

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      {canEdit && (
        <CategoryFormModal fetchCategories={fetchCategories} category={null} />
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Description</TableHeadCell>
            {canEdit && <TableHeadCell>Actions</TableHeadCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description || "N/A"}</TableCell>
              {canEdit && (
                <TableCell>
                  <div className="flex gap-2">
                    <CategoryFormModal
                      fetchCategories={fetchCategories}
                      category={category}
                    />
                    {canDelete && ( // Sadece admin
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => handleDelete(category.id)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryList;
