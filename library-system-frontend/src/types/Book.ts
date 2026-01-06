import type { Author } from "./Author";
import type { Category } from "./Category";

export type Book = {
  id: number;
  title: string;
  isbn: string;
  description?: string;
  publishYear: number;
  availableCopies: number;
  totalCopies: number;
  categoryId: number;
  category?: Category;
  authors?: Author[];
  createdAt?: string;
  updatedAt?: string;
};

export type { Author, Category };