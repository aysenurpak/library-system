import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  TextInput,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { api } from "../../helper/api";
import { toast } from "sonner";
import { showErrors } from "../../helper/helper";

interface User {
  id: number;
  username: string;
}

interface Book {
  id: number;
  title: string;
}

interface Props {
  fetchBorrows: () => void;
}

export const BorrowFormModal = ({ fetchBorrows }: Props) => {
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [borrowDate, setBorrowDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    api.get("auth/users").then((res) => setUsers(res.data));
    api.get("books").then((res) => setBooks(res.data));
  }, []);

  function handleSave() {
    const body = {
      userId: +userId,
      bookId: +bookId,
      borrowDate: new Date(borrowDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
    };

    api
      .post("borrows", body)
      .then(() => {
        fetchBorrows();
        toast.success("Book borrowed successfully");
        resetForm();
        setShow(false);
      })
      .catch((error) => showErrors(error));
  }

  function resetForm() {
    setUserId("");
    setBookId("");
    setBorrowDate(new Date().toISOString().split("T")[0]);
    setDueDate("");
  }

  return (
    <>
      <Button className="ml-auto mb-2" onClick={() => setShow(true)}>
        <FaPlus /> New Borrow
      </Button>

      <Modal show={show} size="md" onClose={() => setShow(false)} popup>
        <ModalHeader>Borrow Book</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId">User</Label>
              <Select
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="bookId">Book</Label>
              <Select
                id="bookId"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                required
              >
                <option value="">Select Book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="borrowDate">Borrow Date</Label>
              <TextInput
                id="borrowDate"
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <TextInput
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
