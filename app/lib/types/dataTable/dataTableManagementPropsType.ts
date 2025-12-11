export interface DataTableManagementPropsTypes<T> {
  data: T[];
  isLoading: boolean;
  // lazyParams: { first: number; rows: number; page: number };
  // totalItems: number;
  // onPageChange: (event: DataTablePageEvent) => void;
  onSetting: (data: T) => void;
  onEdit: (data: T) => void;
  onDelete: (data: T) => void;
}
