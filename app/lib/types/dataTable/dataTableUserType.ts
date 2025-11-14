import { UserData } from "../user";

export interface DataTableUserProp {
  user: UserData[];
  isLoading: boolean;
  // lazyParams: { first: number; rows: number; page: number };
  // totalItems: number;
  // onPageChange: (event: DataTablePageEvent) => void;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
}
