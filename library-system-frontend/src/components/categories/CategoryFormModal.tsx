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
import type { Category } from "../../types/Category";
import { FaEdit, FaPlus } from "react-icons/fa";
import { api } from "../../helper/api";
import { toast } from "sonner";
import { showErrors } from "../../helper/helper";

interface Props {
  fetchCategories: () => void;
  category: Category | null;
}

export const CategoryFormModal = ({ fetchCategories, category }: Props) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");

  function handleSave() {
    const body = { name, description };

    if (category) {
      api
        .patch(`categories/${category.id}`, body)
        .then(() => {
          fetchCategories();
          toast.success("Category updated successfully");
          setShow(false);
        })
        .catch((error) => showErrors(error));
    } else {
      api
        .post("categories", body)
        .then(() => {
          fetchCategories();
          toast.success("Category added successfully");
          resetForm();
          setShow(false);
        })
        .catch((error) => showErrors(error));
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
  }

  return (
    <>
      <Button
        className={category ? "" : "ml-auto mb-2"}
        size={category ? "xs" : "md"}
        color={category ? "green" : "blue"}
        onClick={() => setShow(true)}
      >
        {category ? (
          <FaEdit />
        ) : (
          <>
            <FaPlus /> Add New Category
          </>
        )}
      </Button>

      <Modal show={show} size="md" onClose={() => setShow(false)} popup>
        <ModalHeader>
          {category ? "Update Category" : "Add New Category"}
        </ModalHeader>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
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
