"use client";

import { useLoginForm } from "../hooks/useLoginForm";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const LoginForm = () => {
  const { formik, passwordVisible, togglePasswordVisibility } = useLoginForm();

  // Helper for error messages
  const isInvalid = (field: "email" | "password") =>
    !!(formik.touched[field] && formik.errors[field]);

  const ErrorMessage = ({ field }: { field: "email" | "password" }) => {
    if (!isInvalid(field)) return null;
    return <small className="p-error">{formik.errors[field]}</small>;
  };

  return (
    <form className="flex flex-column gap-4" onSubmit={formik.handleSubmit}>
      {/* Global Status Error */}
      {formik.status && (
        <div className="p-error text-center bg-red-100 p-2 border-round">
          {formik.status}
        </div>
      )}

      {/* Email Input */}
      <div className="grid gap-2">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <InputText
          id="email"
          name="email"
          placeholder="ex: budi@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full ${isInvalid("email") ? "p-invalid" : ""}`}
        />
        <ErrorMessage field="email" />
      </div>

      {/* Password Input */}
      <div className="grid gap-2">
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <div className="p-inputgroup w-full">
          <InputText
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Masukkan password Anda"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full ${isInvalid("password") ? "p-invalid" : ""}`}
          />
          <Button
            type="button"
            icon={passwordVisible ? "pi pi-eye-slash" : "pi pi-eye"}
            className="p-button-secondary p-button-text p-button-plain border-1 border-gray-400"
            onClick={togglePasswordVisibility}
          />
        </div>
        <ErrorMessage field="password" />
      </div>

      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          label="Masuk ke Sistem"
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          className="w-full"
        />
      </div>
    </form>
  );
};
