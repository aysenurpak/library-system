import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
  Button,
  Badge,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { api } from "../../helper/api";
import type { Borrow } from "../../types/Borrow";
import { BorrowFormModal } from "./BorrowFormModal";
import { FaTrash, FaUndo } from "react-icons/fa";
import { toast } from "sonner";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";

const BorrowList = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const { loggedInUser } = useLoggedInUsersContext();

  function fetchBorrows() {
    api.get("borrows").then((res) => setBorrows(res.data));
  }

  useEffect(() => {
    fetchBorrows();
  }, []);

  function handleReturn(id: number) {
    if (confirm("Mark this book as returned?")) {
      api
        .patch(`borrows/return/${id}`)
        .then(() => {
          toast.success("Book returned successfully");
          fetchBorrows();
        })
        .catch(() => toast.error("Failed to return book"));
    }
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this borrow record?")) {
      api
        .delete(`borrows/${id}`)
        .then(() => {
          toast.success("Borrow record deleted successfully");
          fetchBorrows();
        })
        .catch(() => toast.error("Failed to delete borrow record"));
    }
  }

  function getStatusBadge(status: string) {
    const colors: { [key: string]: string } = {
      BORROWED: "warning",
      RETURNED: "success",
      OVERDUE: "failure",
    };
    return <Badge color={colors[status] || "gray"}>{status}</Badge>;
  }

  const canEdit =
    loggedInUser?.role === "admin" || loggedInUser?.role === "librarian";
  const canDelete = loggedInUser?.role === "admin"; 

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Borrowed Books</h2>
      {canEdit && <BorrowFormModal fetchBorrows={fetchBorrows} />}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>User</TableHeadCell>
            <TableHeadCell>Book</TableHeadCell>
            <TableHeadCell>Borrow Date</TableHeadCell>
            <TableHeadCell>Due Date</TableHeadCell>
            <TableHeadCell>Return Date</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            {canEdit && <TableHeadCell>Actions</TableHeadCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {borrows.map((borrow) => (
            <TableRow key={borrow.id}>
              <TableCell>{borrow.id}</TableCell>
              <TableCell>{borrow.user?.username || "N/A"}</TableCell>
              <TableCell>{borrow.book?.title || "N/A"}</TableCell>
              <TableCell>
                {new Date(borrow.borrowDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(borrow.dueDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {borrow.returnDate
                  ? new Date(borrow.returnDate).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell>{getStatusBadge(borrow.status)}</TableCell>
              {canEdit && (
                <TableCell>
                  <div className="flex gap-2">
                    {borrow.status === "BORROWED" && (
                      <Button
                        size="xs"
                        color="green"
                        onClick={() => handleReturn(borrow.id)}
                      >
                        <FaUndo />
                      </Button>
                    )}
                    {canDelete && ( // Sadece admin
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => handleDelete(borrow.id)}
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

export default BorrowList;
