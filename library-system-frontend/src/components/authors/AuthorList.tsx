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
import type { Author } from "../../types/Author";
import { AuthorFormModal } from "./AuthorFormModal";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext"; 

const AuthorList = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const { loggedInUser } = useLoggedInUsersContext(); 

  function fetchAuthors() {
    api.get("authors").then((res) => setAuthors(res.data));
  }

  useEffect(() => {
    fetchAuthors();
  }, []);

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this author?")) {
      api
        .delete(`authors/${id}`)
        .then(() => {
          toast.success("Author deleted successfully");
          fetchAuthors();
        })
        .catch(() => toast.error("Failed to delete author"));
    }
  }

  const canEdit =
    loggedInUser?.role === "admin" || loggedInUser?.role === "librarian";
  const canDelete = loggedInUser?.role === "admin"; 

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Authors</h2>
      {canEdit && <AuthorFormModal fetchAuthors={fetchAuthors} author={null} />}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Country</TableHeadCell>
            <TableHeadCell>Birth Date</TableHeadCell>
            {canEdit && <TableHeadCell>Actions</TableHeadCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map((author) => (
            <TableRow key={author.id}>
              <TableCell>{author.id}</TableCell>
              <TableCell>{author.name}</TableCell>
              <TableCell>{author.country || "N/A"}</TableCell>
              <TableCell>{author.birthDate || "N/A"}</TableCell>
              {canEdit && (
                <TableCell>
                  <div className="flex gap-2">
                    <AuthorFormModal
                      fetchAuthors={fetchAuthors}
                      author={author}
                    />
                    {canDelete && ( // Sadece admin
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => handleDelete(author.id)}
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

export default AuthorList;
