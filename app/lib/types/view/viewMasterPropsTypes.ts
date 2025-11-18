export interface ViewMasterPropsTypes<T> {
  data: T | null;
  isLoading: boolean;
  dialogMode: "view" | "add" | "edit" | null;
}
