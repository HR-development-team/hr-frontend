import { useAuth } from "../context/AuthProvider";

const ADMIN_ROLES = ["ROL0000001", "ROL0000002"];
const EMPLOYEE_ROLES = ["ROL0000003", "ROL0000004", "ROL0000005"];

export const useRole = () => {
  const { user } = useAuth();

  const isAdmin = user ? ADMIN_ROLES.includes(user.role_code) : false;
  const isEmployee = user ? EMPLOYEE_ROLES.includes(user.role_code) : false;

  // You can also add more granular checks here later
  // const canEditProfile = isAdmin || isEmployee;

  return {
    roleCode: user?.role_code,
    isAdmin,
    isEmployee,
  };
};
