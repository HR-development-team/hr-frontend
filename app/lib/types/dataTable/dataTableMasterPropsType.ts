export interface DataTableMasterPropsTypes<T> {
  data: T[];
  isLoading: boolean;
  // lazyParams: { first: number; rows: number; page: number };
  // totalItems: number;
  // onPageChange: (event: DataTablePageEvent) => void;
  onView: (data: T) => void;
  onEdit: (data: T) => void;
  onDelete: (data: T) => void;
}
