import { UserFormData } from "../schemas/userFormSchema";

// status
export const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Karyawan", value: "employee" },
];

export const UserDefaultValues: UserFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  role: "employee",
};
