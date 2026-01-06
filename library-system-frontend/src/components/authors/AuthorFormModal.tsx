import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useState } from "react";
import type { Author } from "../../types/Author";
import { FaEdit, FaPlus } from "react-icons/fa";
import { api } from "../../helper/api";
import { toast } from "sonner";
import { showErrors } from "../../helper/helper";

interface Props {
  fetchAuthors: () => void;
  author: Author | null;
}

export const AuthorFormModal = ({ fetchAuthors, author }: Props) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(author?.name || "");
  const [biography, setBiography] = useState(author?.biography || "");
  const [country, setCountry] = useState(author?.country || "");
  const [birthDate, setBirthDate] = useState(author?.birthDate || "");

  function handleSave() {
    const body = { name, biography, country, birthDate };

    if (author) {
      api
        .patch(`authors/${author.id}`, body)
        .then(() => {
          fetchAuthors();
          toast.success("Author updated successfully");
          setShow(false);
        })
        .catch((error) => showErrors(error));
    } else {
      api
        .post("authors", body)
        .then(() => {
          fetchAuthors();
          toast.success("Author added successfully");
          resetForm();
          setShow(false);
        })
        .catch((error) => showErrors(error));
    }
  }

  function resetForm() {
    setName("");
    setBiography("");
    setCountry("");
    setBirthDate("");
  }

  return (
    <>
      <Button
        className={author ? "" : "ml-auto mb-2"}
        size={author ? "xs" : "md"}
        color={author ? "green" : "blue"}
        onClick={() => setShow(true)}
      >
        {author ? (
          <FaEdit />
        ) : (
          <>
            <FaPlus /> Add New Author
          </>
        )}
      </Button>

      <Modal show={show} size="md" onClose={() => setShow(false)} popup>
        <ModalHeader>{author ? "Update Author" : "Add New Author"}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <TextInput
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <TextInput
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
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
