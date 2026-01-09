import { OfficeNodeData } from "../schemas/organizationSchema";
import { Building2, ChevronRight, Users } from "lucide-react";

interface OfficeNodeCardProps {
  data: OfficeNodeData;
  onDetailClick?: () => void;
}

export default function OfficeNodeCard({
  data,
  onDetailClick,
}: OfficeNodeCardProps) {
  return (
    <div
      className={`flex flex-column align-items-center p-3 surface-card border-2 border-300 border-200 border-round-xl relative overflow-hidden transition-all transition-duration-300 shadow-2 hover:shadow-6 hover:-translate-y-1`}
      style={{ minWidth: "250px" }}
    >
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
        }}
      />

      <div className="flex flex-column h-full">
        <div className="flex justify-content-between align-items-center gap-2 mb-3">
          <div className="flex align-items-center justify-content-center bg-blue-50 text-blue-500 border-round p-2">
            <Building2 size={20} />
          </div>
          <span className="px-2 py-1 text-xs font-medium text-500 surface-100 border-round">
            {data.office_code}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-bold text-800 text-sm mb-1">{data.name}</div>
        <div className="text-xs text-600 text-center font-italic">
          {data.address}
        </div>
      </div>

      {onDetailClick && (
        <div className="flex align-items-center gap-2 justify-content-between pt-3 border-top-1 border-100">
          <div className="flex align-items-center gap-1 text-xs text-400">
            <Users size={14} />
            <span>Struktur</span>
          </div>

          <div
            className="flex align-items-center gap-1 text-xs font-semibold text-blue-600 cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick();
            }}
          >
            <span>Lihat Detail</span>
            <ChevronRight size={14} />
          </div>
        </div>
      )}
    </div>
  );
}
