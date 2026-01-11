import { OfficeNodeData } from "../schemas/organizationSchema";
import { Building2, ChevronRight, UserCircle2, Users } from "lucide-react";

interface OfficeNodeCardProps {
  data: OfficeNodeData;
  onDetailClick?: () => void;
}

export default function OfficeNodeCard({
  data,
  onDetailClick,
}: OfficeNodeCardProps) {
  // Handle Nullable Values gracefully
  const leaderName = data.leader_name || "Nama Tidak Tersedia";
  const leaderPosition = data.leader_position || "Jabatan Belum Diisi";
  const isLeaderSet = data.leader_name || data.leader_position;

  return (
    <div
      className="flex flex-column align-items-center p-3 surface-card border-2 border-300 border-round-xl relative overflow-hidden transition-all transition-duration-300 shadow-2 hover:shadow-6 hover:-translate-y-1"
      style={{ width: "280px" }}
    >
      {/* Top Bar Decoration */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
        }}
      />

      {/* Header: Icon & Code */}
      <div className="w-full flex justify-content-between align-items-center mb-3">
        <div className="flex align-items-center justify-content-center bg-blue-50 text-blue-500 border-round p-2">
          <Building2 size={20} />
        </div>
        <span className="px-2 py-1 text-xs font-medium text-500 surface-100 border-round">
          {data.office_code}
        </span>
      </div>

      {/* Body: Name & Address */}
      <div className="mb-4 text-center w-full">
        <div className="font-bold text-800 text-base mb-1 line-height-3">
          {data.name}
        </div>
        <div className="text-xs text-500 font-italic white-space-normal">
          {data.address || "Alamat belum diatur"}
        </div>
      </div>

      {/* NEW SECTION: Penanggung Jawab / Leader */}
      <div className="w-full bg-gray-50 border-1 border-gray-200 border-round p-2 mb-3 flex align-items-center gap-3 text-left">
        <div className={`${isLeaderSet ? "text-blue-500" : "text-gray-400"}`}>
          <UserCircle2 size={28} />
        </div>
        <div className="flex flex-column overflow-hidden">
          <span
            className={`text-xs font-bold text-overflow-ellipsis white-space-nowrap overflow-hidden ${
              data.leader_name
                ? "text-gray-800"
                : "text-gray-400 font-normal italic"
            }`}
          >
            {leaderName}
          </span>
          <span
            className={`text-xs text-overflow-ellipsis white-space-nowrap overflow-hidden ${
              data.leader_position ? "text-blue-600" : "text-gray-400 italic"
            }`}
          >
            {leaderPosition}
          </span>
        </div>
      </div>

      {/* Footer: Action */}
      {onDetailClick && (
        <div className="w-full flex align-items-center justify-content-between pt-3 border-top-1 border-100 mt-auto">
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
