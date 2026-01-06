import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Select,
  Textarea,
} from "flowbite-react";
import { useState, useEffect } from "react";
import type { Book, Author, Category } from "../../types/Book";
import { FaEdit, FaPlus } from "react-icons/fa";
import { api } from "../../helper/api";
import { toast } from "sonner";
import { showErrors } from "../../helper/helper";

interface Props {
  fetchBooks: () => void;
  book: Book | null;
}

export const BookFormModal = ({ fetchBooks, book }: Props) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(book?.title || "");
  const [isbn, setIsbn] = useState(book?.isbn || "");
  const [description, setDescription] = useState(book?.description || "");
  const [publishYear, setPublishYear] = useState(
    book?.publishYear.toString() || ""
  );
  const [availableCopies, setAvailableCopies] = useState(
    book?.availableCopies.toString() || "1"
  );
  const [totalCopies, setTotalCopies] = useState(
    book?.totalCopies.toString() || "1"
  );
  const [categoryId, setCategoryId] = useState(
    book?.categoryId.toString() || ""
  );
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>(
    book?.authors?.map((a) => a.id) || []
  );

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get("authors").then((res) => setAuthors(res.data));
    api.get("categories").then((res) => setCategories(res.data));
  }, []);

  function handleSave() {
    const body = {
      title,
      isbn,
      description,
      publishYear: +publishYear,
      availableCopies: +availableCopies,
      totalCopies: +totalCopies,
      categoryId: +categoryId,
      authorIds: selectedAuthors,
    };

    if (book) {
      api
        .patch(`books/${book.id}`, body)
        .then(() => {
          fetchBooks();
          toast.success("Book updated successfully");
          setShow(false);
        })
        .catch((error) => showErrors(error));
    } else {
      api
        .post("books", body)
        .then(() => {
          fetchBooks();
          toast.success("Book added successfully");
          resetForm();
          setShow(false);
        })
        .catch((error) => showErrors(error));
    }
  }

  function resetForm() {
    setTitle("");
    setIsbn("");
    setDescription("");
    setPublishYear("");
    setAvailableCopies("1");
    setTotalCopies("1");
    setCategoryId("");
    setSelectedAuthors([]);
  }

  function toggleAuthor(authorId: number) {
    if (selectedAuthors.includes(authorId)) {
      setSelectedAuthors(selectedAuthors.filter((id) => id !== authorId));
    } else {
      setSelectedAuthors([...selectedAuthors, authorId]);
    }
  }

  return (
    <>
      <Button
        className={book ? "" : "ml-auto mb-2"}
        size={book ? "xs" : "md"}
        color={book ? "green" : "blue"}
        onClick={() => setShow(true)}
      >
        {book ? (
          <FaEdit />
        ) : (
          <>
            <FaPlus /> Add New Book
          </>
        )}
      </Button>

      <Modal show={show} size="lg" onClose={() => setShow(false)} popup>
        <ModalHeader>{book ? "Update Book" : "Add New Book"}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <TextInput
                id="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publishYear">Publish Year</Label>
                <TextInput
                  id="publishYear"
                  type="number"
                  value={publishYear}
                  onChange={(e) => setPublishYear(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalCopies">Total Copies</Label>
                <TextInput
                  id="totalCopies"
                  type="number"
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="availableCopies">Available Copies</Label>
                <TextInput
                  id="availableCopies"
                  type="number"
                  value={availableCopies}
                  onChange={(e) => setAvailableCopies(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Authors (Select Multiple)</Label>
              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                {authors.map((author) => (
                  <div key={author.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`author-${author.id}`}
                      checked={selectedAuthors.includes(author.id)}
                      onChange={() => toggleAuthor(author.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`author-${author.id}`}>{author.name}</label>
                  </div>
                ))}
              </div>
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
