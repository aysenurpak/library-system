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
import type { Book } from "../../types/Book";
import { BookFormModal } from "./BookFormModal";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { loggedInUser } = useLoggedInUsersContext();

  function fetchBooks() {
    api.get("books").then((res) => setBooks(res.data));
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this book?")) {
      api
        .delete(`books/${id}`)
        .then(() => {
          toast.success("Book deleted successfully");
          fetchBooks();
        })
        .catch(() => toast.error("Failed to delete book"));
    }
  }

  const canEdit =
    loggedInUser?.role === "admin" || loggedInUser?.role === "librarian";
  const canDelete = loggedInUser?.role === "admin";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Books</h2>

      {canEdit && <BookFormModal fetchBooks={fetchBooks} book={null} />}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>ISBN</TableHeadCell>
            <TableHeadCell>Authors</TableHeadCell>
            <TableHeadCell>Category</TableHeadCell>
            <TableHeadCell>Available/Total</TableHeadCell>
            {canEdit && <TableHeadCell>Actions</TableHeadCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>
                {book.authors?.map((a) => a.name).join(", ") || "N/A"}
              </TableCell>
              <TableCell>{book.category?.name || "N/A"}</TableCell>
              <TableCell>
                {book.availableCopies} / {book.totalCopies}
              </TableCell>
              {canEdit && (
                <TableCell>
                  <div className="flex gap-2">
                    <BookFormModal fetchBooks={fetchBooks} book={book} />
                    {canDelete && (
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => handleDelete(book.id)}
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

export default BookList;
