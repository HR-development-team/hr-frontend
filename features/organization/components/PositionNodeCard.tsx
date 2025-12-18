import { PositionNodeData } from "../schemas/organizationSchema";
import { Briefcase, User } from "lucide-react";

interface PositionNodeCardProps {
  data: PositionNodeData;
}

export default function PositionNodeCard({ data }: PositionNodeCardProps) {
  const isVacant = !data.employee_name;

  // Get Initials (e.g., "Dimas Anggara" -> "DA")
  const initials = data.employee_name
    ? data.employee_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className={`flex flex-column align-items-center surface-card border-1 border-round-xl shadow-2 p-4 relative transition-all transition-duration-300 hover:shadow-6 ${
        isVacant ? "border-gray-300" : "border-blue-200"
      }`}
      style={{ width: "220px" }}
    >
      {/* Header Background */}
      <div
        className="absolute top-0 w-full border-round-top-xl"
        style={{
          height: "60px",
          background: isVacant
            ? "linear-gradient(to bottom, #f3f4f6, transparent)"
            : "linear-gradient(to bottom, #eff6ff, transparent)",
          opacity: 0.8,
        }}
      />

      {/* Avatar Circle */}
      <div className="relative z-1 mb-3">
        <div
          className={`flex align-items-center justify-content-center border-circle border-3 border-white shadow-2 mx-auto ${
            isVacant ? "bg-gray-100 text-gray-400" : "bg-blue-100 text-blue-600"
          }`}
          style={{ width: "64px", height: "64px" }}
        >
          {isVacant ? (
            <User size={30} />
          ) : (
            <span className="text-xl font-bold">{initials}</span>
          )}
        </div>

        {/* Status Indicator Dot */}
        <div
          className={`absolute border-circle border-2 border-white ${
            isVacant ? "bg-red-500" : "bg-green-500"
          }`}
          style={{
            width: "14px",
            height: "14px",
            bottom: "4px",
            right: "4px",
          }}
          title={isVacant ? "Vacant" : "Filled"}
        />
      </div>

      {/* Employee Name */}
      <h4
        className={`font-bold text-center mb-1 mt-0 ${isVacant ? "text-500 italic" : "text-800"}`}
      >
        {data.employee_name || "Vacant Position"}
      </h4>

      {/* Position Title Badge */}
      <div className="flex align-items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 border-round-2xl text-xs font-medium mb-2 border-1 border-gray-200">
        <Briefcase size={12} />
        <span
          className="white-space-nowrap overflow-hidden text-overflow-ellipsis"
          style={{ maxWidth: "140px" }}
          title={data.name}
        >
          {data.name}
        </span>
      </div>

      {/* Position Code */}
      <div className="text-xs text-400 font-mono">{data.position_code}</div>
    </div>
  );
}
