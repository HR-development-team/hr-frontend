// app/payroll/components/LinesTable.tsx

import React from "react";
import { PayrollLine } from "../types";

type Props = { lines: PayrollLine[] };

const LinesTable: React.FC<Props> = ({ lines }) => (
  <div className="flex flex-col gap-3">
    {lines.map((l, idx) => (
      <div key={idx} className="flex justify-between items-center border-b border-dashed border-gray-300 pb-2">
        <span className="text-gray-600">{l.label}</span>
        <span className="font-semibold text-gray-900">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(l.amount)}</span>
      </div>
    ))}
  </div>
);

export default LinesTable;
