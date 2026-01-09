import { Layers, Network } from "lucide-react";
import { StructuredNodeCardProps } from "../schemas/organizationSchema";

export default function StructuredNodeCard({
  type,
  name,
  code,
  description,
}: StructuredNodeCardProps) {
  const isDept = type === "department";

  return (
    <div
      className={`flex flex-column align-items-center p-3 surface-card border-2 border-300 border-200 border-round-xl relative overflow-hidden transition-all transition-duration-300 shadow-2 hover:shadow-6 hover:-translate-y-1`}
      style={{ minWidth: "250px" }}
    >
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "4px",
          background: `linear-gradient(90deg, ${isDept ? " #de1d30ff 0%, #e71f62ff" : "#27de1dff 0%, #1fe73aff"}  100%)`,
        }}
      />

      <div className="flex flex-column h-full">
        <div className="flex justify-content-between align-items-center gap-2 mb-3">
          <div
            className={`flex align-items-center justify-content-center ${isDept ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"} text-blue-500 border-round p-2`}
          >
            {isDept ? <Network size={20} /> : <Layers />}
          </div>
          <span className="px-2 py-1 text-xs font-medium text-500 surface-100 border-round">
            {code}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-bold text-800 text-sm mb-1">
          {isDept ? "Departemen" : "Divisi"} {name}
        </div>
        <div className="text-xs text-600 text-center font-italic">
          {description}
        </div>
      </div>
    </div>
  );
}