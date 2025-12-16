import { PositionNodeData } from "@features/office-organization/schemas/officeOrganizationSchema";
import { Briefcase } from "lucide-react";

interface PositionNodeCardProps {
  data: PositionNodeData;
}

export default function PositionNodeCard({ data }: PositionNodeCardProps) {
  return (
    <div
      className="flex flex-column align-items-center surface-card border-1 border-300 border-round-xl shadow-2 p-4 relative transition-all transition-duration-300 hover:shadow-6 hover:border-green-400"
      style={{ width: "220px" }}
    >
      <div
        className="absolute top-0 w-full border-round-top-xl"
        style={{
          height: "60px",
          background: "linear-gradient(to bottom, #f0fdf4, transparent)",
          opacity: 0.6,
        }}
      />

      <div className="relative z-1 mb-3">
        <div
          className="flex align-items-center justify-content-center border-circle border-3 border-white shadow-2 bg-green-100 text-green-700 mx-auto"
          style={{ width: "64px", height: "64px" }}
        >
          <span className="text-xl font-bold">N/A</span>
        </div>
        <div
          className="absolute border-circle bg-red-100 border-2 border-white"
          style={{
            width: "14px",
            height: "14px",
            bottom: "4px",
            right: "4px",
          }}
        />
      </div>

      <h4 className="font-bold text-800 text-center mb-1 mt-0">{data.name}</h4>

      <div className="flex align-items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border-round-2xl text-xs font-medium mb-2 border-1 border-green-100">
        <Briefcase size={12} />
        <span
          className="white-space-nowrap overflow-hidden text-overflow-ellipsis"
          style={{ maxWidth: "140px" }}
        >
          {data.name}
        </span>
      </div>
      <div className="text-xs text-600 font-mono surface-50 px-2 py-1 border-round">
        {data.position_code}
      </div>
    </div>
  );
}
