export interface PayrollLine {
  label: string;
  amount: number;
}

export interface Employee {
  id: number;
  name: string;
  nik: string;
  position: string;
  department: string;
  bank_account: string;
  email: string;
}

export interface Payroll {
  id: number;
  generated_at: string;
  period_label: string;
  employee: Employee;
  earnings: PayrollLine[];
  deductions: PayrollLine[];
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
}