import FormDropdown from "@/components/form/FormDropdown";
import FormInputNumber from "@/components/form/FormInputNumber";
import { LeaveBalanceFormData } from "@/lib/schemas/leaveBalanceFormSchema";
import { GetAllEmployeeData } from "@/lib/types/employee";
import { GetAllLeaveTypeData } from "@/lib/types/leaveType";
import { FormikContextType } from "formik";
import { Button } from "primereact/button";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";

interface SingleAddProps {
  formik: FormikContextType<LeaveBalanceFormData>;
  leaveTypeOptions: GetAllLeaveTypeData[];
  employeeOptions: GetAllEmployeeData[];
  isLeaveTypeLoading: boolean;
  isEmployeeLoading: boolean;
  isSubmitting: boolean;
  isFieldInvalid: (fieldName: keyof LeaveBalanceFormData) => boolean;
  getFieldError: (fieldName: keyof LeaveBalanceFormData) => string | undefined;
}

export default function AddSingle({
  formik,
  leaveTypeOptions,
  employeeOptions,
  isLeaveTypeLoading,
  isEmployeeLoading,
  isSubmitting,
  isFieldInvalid,
  getFieldError,
}: SingleAddProps) {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
      {/* can hidden or block according dialogMode */}
      <FormDropdown
        props={{
          ...formik.getFieldProps("employee_code"),
          options: employeeOptions,
          optionLabel: "full_name",
          optionValue: "employee_code",
          filter: true,
          filterDelay: 400,
          placeholder: "Pilih Karyawan",
          onChange: (e) => {
            formik.setFieldValue("employee_code", e.value);
          },
          loading: isEmployeeLoading,
        }}
        fieldName={"employee_code"}
        label="Nama Karyawan"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormDropdown
        props={{
          ...formik.getFieldProps("type_code"),
          options: leaveTypeOptions,
          optionLabel: "name",
          optionValue: "type_code",
          filter: true,
          filterDelay: 400,
          placeholder: "Pilih Tipe Cuti",
          loading: isLeaveTypeLoading,
          onChange: (e) => {
            formik.setFieldValue("type_code", e.value);
          },
        }}
        fieldName={"type_code"}
        label="Tipe Cuti"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormInputNumber
        props={{
          value: formik.values.year,
          onValueChange: (e: InputNumberValueChangeEvent) => {
            formik.setFieldValue("year", e.value);
          },
          onBlur: formik.handleBlur,
          min: 2000,
          max: 9999,
          useGrouping: false,
        }}
        fieldName={"year"}
        label="Tahun Cuti Berlaku"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />
      <div>
        <FormInputNumber
          props={{
            value: formik.values.balance,
            onValueChange: (e: InputNumberValueChangeEvent) => {
              formik.setFieldValue("balance", e.value);
            },
            onBlur: formik.handleBlur,
          }}
          fieldName={"balance"}
          label="Jumlah Saldo Cuti"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />
      </div>

      <div className="flex justify-content-end mt-4">
        <Button
          type="submit"
          label={"Simpan"}
          icon={"pi pi-save"}
          severity={"success"}
          loading={isSubmitting}
          pt={{
            icon: {
              className: "mr-2",
            },
          }}
        />
      </div>
    </form>
  );
}
