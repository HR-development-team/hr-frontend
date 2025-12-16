/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../context/AuthProvider";
import { useToastContext } from "@components/ToastProvider";
import { LoginFormData, loginFormSchema } from "../schemas/loginFormSchema";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ADMIN_ROLES = ["ROL0000001", "ROL0000002"];
const EMPLOYEE_ROLES = ["ROL0000003", "ROL0000004", "ROL0000005"];

export const useLoginForm = () => {
  const router = useRouter();
  const { login } = useAuth(); // <--- Equivalent to useSave
  const { showToast } = useToastContext();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      // Zod validation logic
      const result = loginFormSchema.safeParse(values);
      if (result.success) return {};

      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[String(issue.path[0])] = issue.message;
      });
      return errors;
    },
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        const response = await login(values); // Call AuthContext

        showToast("success", "Login Berhasil", "Selamat Datang");

        // Redirect Logic
        const roleCode = response.auth.user.role_code;
        if (ADMIN_ROLES.includes(roleCode)) {
          router.push("/admin/dashboard");
        } else if (EMPLOYEE_ROLES.includes(roleCode)) {
          router.push("/karyawan/Dashboard");
        } else {
          router.push("/");
        }
      } catch (error: any) {
        setStatus(error.message);
        showToast("error", "Login Gagal", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return {
    formik,
    passwordVisible,
    togglePasswordVisibility: () => setPasswordVisible(!passwordVisible),
  };
};
