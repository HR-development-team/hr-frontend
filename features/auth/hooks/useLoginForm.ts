/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../context/AuthProvider";
import { useToastContext } from "@components/ToastProvider";
import { LoginFormData, loginFormSchema } from "../schemas/loginFormSchema";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EMPLOYEE_ROLES = ["Employee"];

export const useLoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToastContext();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
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
        const response = await login(values);

        showToast("success", "Login Berhasil", "Selamat Datang");

        const userRoleName = response.auth.user.role_name;

        if (EMPLOYEE_ROLES.includes(userRoleName)) {
          router.push("/karyawan/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      } catch (err: any) {
        const errorData = err.response?.data;
        const validationErrors = errorData?.errors;

        let displayMessage = "Terjadi kesalahan saat menyimpan data shift";
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          displayMessage = validationErrors
            .map((e: any) => e.message)
            .join(", ");
        } else if (errorData?.message) {
          displayMessage = errorData.message;
        }

        showToast("error", "Gagal", displayMessage);
        setStatus(displayMessage);
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
