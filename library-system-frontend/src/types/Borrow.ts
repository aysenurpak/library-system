export type Borrow = {
    id: number;
    userId: number;
    bookId: number;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: string; // 'BORROWED' | 'RETURNED' | 'OVERDUE'
    user?: {
      id: number;
      username: string;
      fullName?: string;
    };
    book?: {
      id: number;
      title: string;
      isbn: string;
    };
  };